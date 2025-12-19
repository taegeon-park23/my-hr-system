package com.hr.modules.notification.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import com.hr.modules.notification.controller.dto.AnnouncementResponse;
import com.hr.modules.notification.controller.dto.InAppNotificationResponse;
import com.hr.modules.notification.service.NotificationService;
import com.hr.modules.notification.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final SseService sseService;

    @GetMapping(value = "/subscribe", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter subscribe(@AuthenticationPrincipal UserPrincipal user) {
        return sseService.subscribe(user.getId());
    }

    @GetMapping("/announcements")
    public ApiResponse<List<AnnouncementResponse>> getAnnouncements(@AuthenticationPrincipal UserPrincipal user) {
        return ApiResponse.success(
            notificationService.getAnnouncements(Long.parseLong(user.getCompanyId())).stream()
                .map(a -> AnnouncementResponse.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .author(a.getAuthor())
                        .createdAt(a.getCreatedAt())
                        .type(a.getType())
                        .build())
                .collect(Collectors.toList())
        );
    }

    @GetMapping
    public ApiResponse<List<InAppNotificationResponse>> getNotifications(@AuthenticationPrincipal UserPrincipal user) {
        return ApiResponse.success(
            notificationService.getNotifications(user.getId()).stream()
                .map(n -> InAppNotificationResponse.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .link(n.getLink())
                        .read(n.isRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList())
        );
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Void> readNotification(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null);
    }
}
