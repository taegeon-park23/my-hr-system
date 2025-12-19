package com.hr.modules.attendance.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendanceSummaryResponse {
    private double totalHours;
    private long lateCount;
    private long absentCount;
    private long vacationUsed;
}
