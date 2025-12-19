package com.hr.modules.approval.service;

import com.hr.modules.approval.api.ApprovalModuleApi;
import com.hr.modules.approval.api.dto.ApprovalRequestCommand;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.domain.ApprovalStep;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import com.hr.modules.approval.repository.ApprovalStepRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import java.util.List;

@Service
@Transactional
public class ApprovalService implements ApprovalModuleApi {

    private final ApprovalRequestRepository approvalRepository;
    private final ApprovalStepRepository approvalStepRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final com.hr.modules.approval.repository.ApprovalRuleRepository approvalRuleRepository;
    private final com.hr.modules.user.api.UserModuleApi userApi;

    public ApprovalService(ApprovalRequestRepository approvalRepository,
                           ApprovalStepRepository approvalStepRepository,
                           ApplicationEventPublisher eventPublisher,
                           com.hr.modules.approval.repository.ApprovalRuleRepository approvalRuleRepository,
                           com.hr.modules.user.api.UserModuleApi userApi) {
        this.approvalRepository = approvalRepository;
        this.approvalStepRepository = approvalStepRepository;
        this.eventPublisher = eventPublisher;
        this.approvalRuleRepository = approvalRuleRepository;
        this.userApi = userApi;
    }


    @Override
    public Long createApproval(ApprovalRequestCommand command) {
        ApprovalRequest request = new ApprovalRequest();
        
        request.setCompanyId(command.getCompanyId());
        request.setRequesterUserId(command.getRequesterId());
        request.setResourceType(command.getResourceType());
        request.setResourceId(command.getResourceId());
        request.setTitle(command.getTitle());
        request.setStatus("PENDING");
        request.setCurrentStepOrder(1);
        
        if (command.getApproverIds() != null) {
            for (Long approverId : command.getApproverIds()) {
                request.addStep(approverId);
            }
        }
        
        ApprovalRequest saved = approvalRepository.save(request);
        
        // Publish Event
        eventPublisher.publishEvent(new com.hr.common.event.ApprovalRequestedEvent(
            saved.getCompanyId(),
            saved.getId(),
            saved.getRequesterUserId(),
            saved.getTitle(),
            saved.getResourceType()
        ));
        
        return saved.getId();
    }

    @Transactional(readOnly = true)
    public ApprovalRequest getApprovalRequest(Long id) {
        return approvalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Approval Request not found: " + id));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createInitialApprovalStep(Long requestId, Long approverId) {
        ApprovalRequest request = getApprovalRequest(requestId);
        request.addStep(approverId);
        // If it's the first step, activate it
        if (request.getSteps().size() == 1) {
            request.getSteps().get(0).activate();
        }
        approvalRepository.save(request);
    }
    
    public void approveStep(Long stepId, Long approverUserId, String comment) {
        ApprovalStep step = approvalStepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Step not found: " + stepId));
                
        if (!step.getApproverId().equals(approverUserId)) {
            throw new IllegalStateException("You are not the approver for this step.");
        }
        
        ApprovalRequest request = step.getRequest();
        if (!request.getCurrentStepOrder().equals(step.getStepOrder())) {
            throw new IllegalStateException("It is not your turn to approve.");
        }

        step.approve(comment);
        
        // Find next step
        int nextOrder = request.getCurrentStepOrder() + 1;
        ApprovalStep nextStep = request.getSteps().stream()
                .filter(s -> s.getStepOrder() == nextOrder)
                .findFirst()
                .orElse(null);

        if (nextStep != null) {
            request.setCurrentStepOrder(nextOrder);
            nextStep.activate();
        } else {
            // Final approval
            request.approve();
            eventPublisher.publishEvent(new com.hr.common.event.ApprovalCompletedEvent(
                request.getCompanyId(),
                request.getId(),
                request.getRequesterUserId(),
                request.getResourceType()
            ));
        }
    }
    
    public void rejectStep(Long stepId, Long approverUserId, String comment) {
        ApprovalStep step = approvalStepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Step not found: " + stepId));
                
        if (!step.getApproverId().equals(approverUserId)) {
            throw new IllegalStateException("You are not the approver for this step.");
        }
        
        step.reject(comment);
        
        ApprovalRequest request = step.getRequest();
        request.reject();

        eventPublisher.publishEvent(new com.hr.common.event.ApprovalCompletedEvent(
            request.getCompanyId(),
            request.getId(),
            request.getRequesterUserId(),
            request.getResourceType()
        ));
    }

    public List<ApprovalRequest> getInbox(Long companyId, Long userId) {
        return approvalRepository.findByCompanyIdAndRequesterUserId(companyId, userId);
    }

    public List<ApprovalRequest> getPending(Long companyId, Long userId) {
        return approvalRepository.findPendingRequests(companyId, userId);
    }

    public List<ApprovalRequest> getArchive(Long companyId, Long userId) {
        return approvalRepository.findArchiveRequests(companyId, userId);
    }

    public List<ApprovalRequest> getAdminApprovals(Long companyId) {
        return approvalRepository.findByCompanyId(companyId);
    }

    public void forceApprovalDecision(Long requestId, String status, String comment) {
        ApprovalRequest request = approvalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Request not found: " + requestId));
        
        if ("APPROVED".equals(status)) {
            request.approve();
        } else if ("REJECTED".equals(status)) {
            request.reject();
        } else {
            throw new IllegalArgumentException("Invalid status for force decision: " + status);
        }
        
        approvalRepository.save(request);
        
        eventPublisher.publishEvent(new com.hr.common.event.ApprovalCompletedEvent(
            request.getCompanyId(),
            request.getId(),
            request.getRequesterUserId(),
            request.getResourceType()
        ));
    }

    public com.hr.modules.approval.dto.ApprovalLinePreviewResponse getLinePreview(Long userId, Long companyId, String requestType) {
        java.util.List<com.hr.modules.approval.domain.ApprovalRule> rules = 
                approvalRuleRepository.findAllByCompanyIdAndRequestTypeOrderByPriorityAsc(companyId, requestType != null ? requestType : "GENERAL");
        
        java.util.List<com.hr.modules.approval.dto.ApprovalLinePreviewResponse.ApproverInfo> steps = new java.util.ArrayList<>();
        
        if (rules.isEmpty()) {
            // Default: Requester -> Manager
            try {
                Long managerId = userApi.getManagerIdOfUser(userId);
                com.hr.modules.user.api.UserInfoDto managerInfo = userApi.getUserInfo(managerId);
                steps.add(com.hr.modules.approval.dto.ApprovalLinePreviewResponse.ApproverInfo.builder()
                        .stepOrder(1)
                        .approverId(managerId)
                        .approverName(managerInfo.getName())
                        .build());
            } catch (Exception e) {
                // No manager found, return empty or handle accordingly
            }
        } else {
            com.hr.modules.user.api.UserInfoDto userInfo = userApi.getUserInfo(userId);
            int order = 1;
            for (com.hr.modules.approval.domain.ApprovalRule rule : rules) {
                Long approverId = null;
                if ("TEAM_LEADER".equals(rule.getApprovalLineKey())) {
                    try { approverId = userApi.getManagerIdOfUser(userId); } catch (Exception e) {}
                } else if ("DEPT_HEAD".equals(rule.getApprovalLineKey())) {
                    approverId = userApi.getDeptHeadId(userInfo.getDeptId());
                }
                
                if (approverId != null && !approverId.equals(userId)) {
                    com.hr.modules.user.api.UserInfoDto appInfo = userApi.getUserInfo(approverId);
                    steps.add(com.hr.modules.approval.dto.ApprovalLinePreviewResponse.ApproverInfo.builder()
                            .stepOrder(order++)
                            .approverId(approverId)
                            .approverName(appInfo.getName())
                            .build());
                }
            }
        }

        return com.hr.modules.approval.dto.ApprovalLinePreviewResponse.builder()
                .steps(steps)
                .build();
    }
}

