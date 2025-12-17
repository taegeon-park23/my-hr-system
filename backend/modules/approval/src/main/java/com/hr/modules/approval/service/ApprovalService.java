package com.hr.modules.approval.service;

import com.hr.modules.approval.api.ApprovalModuleApi;
import com.hr.modules.approval.api.dto.ApprovalRequestCommand;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprovalService implements ApprovalModuleApi {


    private final ApprovalRequestRepository approvalRepository;
    private final com.hr.modules.approval.repository.ApprovalStepRepository approvalStepRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    public Long createApproval(ApprovalRequestCommand command) {
        ApprovalRequest request = new ApprovalRequest();
        
        request.setCompanyId(command.getCompanyId());
        request.setRequesterUserId(command.getRequesterId());
        request.setResourceType(command.getResourceType());
        request.setResourceId(command.getResourceId());
        request.setTitle(command.getTitle());
        request.setStatus("PENDING"); 
        
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

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void createInitialApprovalStep(Long requestId, Long approverId) {
        ApprovalRequest request = approvalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Request not found: " + requestId));

        com.hr.modules.approval.domain.ApprovalStep step = new com.hr.modules.approval.domain.ApprovalStep(request, approverId, 1);
        approvalStepRepository.save(step);
    }
    
    @Transactional
    public void approveStep(Long stepId) {
        com.hr.modules.approval.domain.ApprovalStep step = approvalStepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Step not found: " + stepId));
                
        step.approve();
        
        // Check if request needs update (MVP: if step 1 approved -> request approved)
        // In real logic, we check if all steps are done.
        ApprovalRequest request = step.getRequest();
        request.setStatus("APPROVED"); // Simple completion for MVP
        
        eventPublisher.publishEvent(new com.hr.common.event.ApprovalCompletedEvent(
            request.getCompanyId(),
            request.getId(),
            request.getRequesterUserId(),
            request.getResourceType()
        ));
    }
    
    @Transactional
    public void rejectStep(Long stepId) {
        com.hr.modules.approval.domain.ApprovalStep step = approvalStepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Approval Step not found: " + stepId));
                
        step.reject();
        
        ApprovalRequest request = step.getRequest();
        request.setStatus("REJECTED");
    }
}
