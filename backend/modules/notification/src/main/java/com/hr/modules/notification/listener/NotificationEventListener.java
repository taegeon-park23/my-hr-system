package com.hr.modules.notification.listener;

import com.hr.common.event.ApprovalCompletedEvent;
import com.hr.common.event.ApprovalRequestedEvent;
import com.hr.modules.notification.service.NotificationService;
import com.hr.modules.notification.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final SseService sseService;
    
    // In a real scenario, we might need to find WHO to notify.
    // For ApprovalRequested, we notify the current approver.
    // For ApprovalCompleted, we notify the requester.

    @EventListener
    public void handleApprovalRequested(ApprovalRequestedEvent event) {
        // Simple mock behavior: Notify the requester that it was sent (or find the actual approver if possible)
        // In the current architecture, the event doesn't carry the approverId.
        // We'll just create a notification message.
        String message = String.format("결재 요청 [%s]이 등록되었습니다.", event.getTitle());
        notificationService.createNotification(event.getCompanyId(), event.getRequesterId(), message, "/dashboard/approval");
        sseService.send(event.getRequesterId(), "notification", message);
    }

    @EventListener
    public void handleApprovalCompleted(ApprovalCompletedEvent event) {
        String message = String.format("결재 [%s]건이 처리되었습니다.", event.getResourceType());
        notificationService.createNotification(event.getCompanyId(), event.getRequesterId(), message, "/dashboard/approval");
        sseService.send(event.getRequesterId(), "notification", message);
    }
}
