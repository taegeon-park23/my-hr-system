package com.hr.attendance.controller;

import com.hr.attendance.dto.AttendanceRequest;
import com.hr.attendance.service.AttendanceService;
import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

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
