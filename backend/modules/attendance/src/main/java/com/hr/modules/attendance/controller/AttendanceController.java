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
    public ApiResponse<List<AttendanceLogResponse>> getMyLog(@AuthenticationPrincipal UserPrincipal user) {
        // Breaking Change: Removed @RequestParam Long userId, using Authenticated User
        return ApiResponse.success(
            attendanceService.getMyLogs(user.getId())
                    .stream()
                    .map(AttendanceLogResponse::from)
                    .collect(Collectors.toList())
        );
    }

    @PostMapping("/check-in")
    public ApiResponse<String> checkIn(@AuthenticationPrincipal UserPrincipal user, 
                                       @RequestBody AttendanceRequest request) {
        attendanceService.checkIn(user.getId(), user.getCompanyId(), request);
        return ApiResponse.success("Check-in successful");
    }

    @PostMapping("/check-out")
    public ApiResponse<String> checkOut(@AuthenticationPrincipal UserPrincipal user) {
        attendanceService.checkOut(user.getId());
        return ApiResponse.success("Check-out successful");
    }
}
