package com.hr.queries.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryDto {
    private long totalEmployees;
    private long pendingApprovals;
    private long approvedApprovals;
    private long rejectedApprovals;
    private long todayAttendance;
}
