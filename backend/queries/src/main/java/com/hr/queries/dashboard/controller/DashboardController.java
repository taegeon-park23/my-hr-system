package com.hr.queries.dashboard.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import com.hr.queries.dashboard.dto.DashboardSummaryDto;
import com.hr.queries.dashboard.service.DashboardQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardQueryService dashboardQueryService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryDto> getSummary(@AuthenticationPrincipal UserPrincipal user) {
        Long companyId = Long.parseLong(user.getCompanyId());
        return ApiResponse.success(dashboardQueryService.getSummary(companyId));
    }

    @GetMapping("/dept-stats")
    public ApiResponse<java.util.List<com.hr.queries.dashboard.dto.DepartmentStatDto>> getDeptStats(@AuthenticationPrincipal UserPrincipal user) {
        Long companyId = Long.parseLong(user.getCompanyId());
        return ApiResponse.success(dashboardQueryService.getDepartmentStats(companyId));
    }
}
