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
    private final com.hr.modules.user.api.UserModuleApi userApi;

    public ApprovalService(ApprovalRequestRepository approvalRepository,
                           ApprovalStepRepository approvalStepRepository,
                           ApplicationEventPublisher eventPublisher,
                           com.hr.modules.user.api.UserModuleApi userApi) {
        this.approvalRepository = approvalRepository;
        this.approvalStepRepository = approvalStepRepository;
        this.eventPublisher = eventPublisher;
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

    public com.hr.modules.approval.controller.dto.ApprovalLinePreviewResponse getLinePreview(Long userId) {
        // Simple logic: Requester -> Manager
        Long managerId = userApi.getManagerIdOfUser(userId);
        com.hr.modules.user.api.UserInfoDto managerInfo = userApi.getUserInfo(managerId);

        return com.hr.modules.approval.controller.dto.ApprovalLinePreviewResponse.builder()
                .steps(java.util.List.of(
                    com.hr.modules.approval.controller.dto.ApprovalLinePreviewResponse.ApproverInfo.builder()
                        .stepOrder(1)
                        .approverId(managerId)
                        .approverName(managerInfo.getName())
                        .build()
                ))
                .build();
    }
}

