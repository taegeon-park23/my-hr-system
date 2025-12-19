package com.hr.modules.notification.controller.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {
    private String title;
    private String content;
    private String author;
    private String type;
}
