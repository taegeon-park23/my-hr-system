package com.hr.modules.attendance.controller;

import com.hr.modules.attendance.dto.AttendanceLogResponse;
import com.hr.modules.attendance.dto.AttendanceRequest;
import com.hr.modules.attendance.service.AttendanceService;
import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/my")
    public ApiResponse<List<AttendanceLogResponse>> getMyLog(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<com.hr.modules.attendance.domain.AttendanceLog> logs;
        if (year != null && month != null) {
            logs = attendanceService.getMyLogsByMonth(user.getId(), year, month);
        } else {
            logs = attendanceService.getMyLogs(user.getId());
        }
        
        return ApiResponse.success(
            logs.stream()
                    .map(AttendanceLogResponse::from)
                    .collect(Collectors.toList())
        );
    }

    @GetMapping("/summary")
    public ApiResponse<com.hr.modules.attendance.dto.AttendanceSummaryResponse> getSummary(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "2025") int year,
            @RequestParam(defaultValue = "12") int month
    ) {
        return ApiResponse.success(attendanceService.getMonthlySummary(user.getId(), year, month));
    }


    @PostMapping("/check-in")
    public ApiResponse<String> checkIn(@AuthenticationPrincipal UserPrincipal user, 
                                       @RequestBody AttendanceRequest request) {
        attendanceService.checkIn(user.getId(), Long.parseLong(user.getCompanyId()), request);
        return ApiResponse.success("Check-in successful");
    }

    @PostMapping("/check-out")
    public ApiResponse<String> checkOut(@AuthenticationPrincipal UserPrincipal user) {
        attendanceService.checkOut(user.getId());
        return ApiResponse.success("Check-out successful");
    }
}
