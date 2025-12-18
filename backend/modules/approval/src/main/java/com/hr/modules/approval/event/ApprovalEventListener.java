package com.hr.modules.approval.event;

import com.hr.common.event.ApprovalRequestedEvent;
import com.hr.modules.approval.service.ApprovalService;
import com.hr.modules.user.api.UserModuleApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class ApprovalEventListener {

    private static final Logger log = LoggerFactory.getLogger(ApprovalEventListener.class);

    private final UserModuleApi userModuleApi;
    private final ApprovalService approvalService;

    public ApprovalEventListener(UserModuleApi userModuleApi, ApprovalService approvalService) {
        this.userModuleApi = userModuleApi;
        this.approvalService = approvalService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleApprovalRequested(ApprovalRequestedEvent event) {
        log.info("Handling ApprovalRequestedEvent for requestId: {}, requesterId: {}", event.getApprovalId(), event.getRequesterId());

        try {
            Long managerId = userModuleApi.getManagerIdOfUser(event.getRequesterId());
            log.info("Resolved Manager ID: {} for Requester ID: {}", managerId, event.getRequesterId());

            // Delegate to Service
            approvalService.createInitialApprovalStep(event.getApprovalId(), managerId);
            
            log.info("Created ApprovalStep for Request: {} assigned to Approver: {}", event.getApprovalId(), managerId);

        } catch (Exception e) {
            log.error("Failed to create approval step for request: {}. Cause: {}", event.getApprovalId(), e.getMessage(), e);
        }
    }
}
