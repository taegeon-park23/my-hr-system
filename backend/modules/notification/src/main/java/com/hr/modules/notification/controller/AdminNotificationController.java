package com.hr.modules.notification.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import com.hr.modules.notification.domain.Announcement;
import com.hr.modules.notification.controller.dto.AnnouncementRequest;
import com.hr.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/announcements")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ApiResponse<Long> createAnnouncement(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody AnnouncementRequest request
    ) {
        Announcement announcement = Announcement.builder()
                .companyId(Long.parseLong(user.getCompanyId()))
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor() != null ? request.getAuthor() : user.getEmail())
                .type(request.getType())
                .build();
        
        Announcement saved = notificationService.createAnnouncement(announcement);
        return ApiResponse.success(saved.getId());
    }
}
