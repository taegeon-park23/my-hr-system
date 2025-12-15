package com.hr.modules.vacation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.vacation.domain.VacationBalance;
import com.hr.modules.vacation.domain.VacationRequest;
import com.hr.modules.vacation.dto.VacationRequestDto;
import com.hr.modules.vacation.service.VacationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vacations")
@RequiredArgsConstructor
public class VacationController {

    private final VacationService vacationService;

    @GetMapping("/balance")
    public ApiResponse<VacationBalance> getMyBalance(
            @RequestParam(defaultValue = "2025") int year,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(vacationService.getBalance(user.getCompanyId(), user.getId(), year));
    }

    @GetMapping("/requests")
    public ApiResponse<List<VacationRequest>> getMyRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(vacationService.getMyRequests(user.getId()));
    }

    @PostMapping("/request")
    public ApiResponse<VacationRequest> requestVacation(
            @RequestBody VacationRequestDto dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {

        return ApiResponse.success(
                vacationService.requestVacation(
                        user.getCompanyId(), 
                        user.getId(), 
                        dto.getType(), 
                        dto.getStartDate(), 
                        dto.getEndDate(), 
                        dto.getReason()
                )
        );
    }
}
