package com.hr.modules.notification.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementRequest {
    private String title;
    private String content;
    private String author;
    private String type;
}
