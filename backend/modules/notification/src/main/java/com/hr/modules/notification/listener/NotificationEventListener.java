package com.hr.modules.notification.listener;

import com.hr.common.event.ApprovalRequestedEvent;
import com.hr.modules.notification.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final MailService mailService;

    @EventListener
    public void handleApprovalRequested(ApprovalRequestedEvent event) {
        log.info("Handling ApprovalRequestedEvent for approvalId: {}", event.getApprovalId());
        
        // In a real system, we would look up the approver's email.
        // For MVP/Demo, we will send to a fixed test email or derive it.
        // Let's send to "admin@company.com" or similar for now.
        
        String to = "manager@test.com"; // Placeholder
        String subject = "[Approval Req] " + event.getTitle();
        String text = String.format("User %d requested approval for %s (ID: %d).", 
                                    event.getRequesterId(), event.getResourceType(), event.getApprovalId());
        
        mailService.sendEmail(
            event.getCompanyId(),
            to,
            subject,
            text,
            "APPROVAL_REQ",
            event.getApprovalId()
        );
    }
}
