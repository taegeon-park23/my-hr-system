package com.hr.modules.notification.controller.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class InAppNotificationResponse {
    private Long id;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;
}
