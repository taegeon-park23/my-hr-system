package com.hr.modules.attendance.dto;

import com.hr.modules.attendance.domain.AttendanceLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class AttendanceLogResponse {
    private Long id;
    private LocalDate date;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String workType;
    private String ipAddress;

    public static AttendanceLogResponse from(AttendanceLog log) {
        return AttendanceLogResponse.builder()
                .id(log.getId())
                .date(log.getDate())
                .checkInTime(log.getCheckInTime())
                .checkOutTime(log.getCheckOutTime())
                .workType(log.getWorkType())
                .ipAddress(log.getIpAddress())
                .build();
    }
}
