package com.hr.modules.attendance.dto;

import lombok.Data;

@Data
public class AttendanceRequest {
    private String workType; // NORMAL, REMOTE
    private String ipAddress;
}

