package com.hr.modules.approval.event;

import com.hr.common.event.ApprovalRequestedEvent;
import com.hr.modules.approval.domain.ApprovalRequest;
// import com.hr.modules.approval.domain.ApprovalStep; // Removed
import com.hr.modules.approval.repository.ApprovalRequestRepository;
// import com.hr.modules.approval.repository.ApprovalStepRepository; // Removed
import com.hr.modules.approval.service.ApprovalService; // Added
import com.hr.modules.user.api.UserModuleApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApprovalEventListener {

    private final UserModuleApi userModuleApi;
    private final ApprovalService approvalService;
    // private final ApprovalStepRepository approvalStepRepository; // Removed
    private final ApprovalRequestRepository approvalRequestRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleApprovalRequested(ApprovalRequestedEvent event) {
        log.info("Handling ApprovalRequestedEvent for requestId: {}, requesterId: {}", event.getApprovalId(), event.getRequesterId());

        try {
            Long managerId = userModuleApi.getManagerIdOfUser(event.getRequesterId());
            log.info("Resolved Manager ID: {} for Requester ID: {}", managerId, event.getRequesterId());

            ApprovalRequest request = approvalRequestRepository.findById(event.getApprovalId())
                    .orElseThrow(() -> new IllegalArgumentException("Approval Request not found: " + event.getApprovalId()));

            // Delegate to Service with REQUIRES_NEW transaction to ensure persistence in AFTER_COMMIT phase
            approvalService.createInitialApprovalStep(request.getId(), managerId);
            
            log.info("Created ApprovalStep for Request: {} assigned to Approver: {}", request.getId(), managerId);

        } catch (Exception e) {
            log.error("Failed to create approval step for request: {}. Cause: {}", event.getApprovalId(), e.getMessage(), e);
            // In a real system, we might want to update the request status to ERROR or retry.
        }
    }
}
