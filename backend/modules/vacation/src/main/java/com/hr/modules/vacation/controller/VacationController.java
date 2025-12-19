package com.hr.modules.vacation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.vacation.dto.VacationBalanceResponse;
import com.hr.modules.vacation.dto.VacationRequestDto;
import com.hr.modules.vacation.dto.VacationRequestResponse;
import com.hr.modules.vacation.service.VacationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vacations")
@RequiredArgsConstructor
public class VacationController {

    private final VacationService vacationService;

    @GetMapping("/balance")
    public ApiResponse<VacationBalanceResponse> getMyBalance(
            @RequestParam(defaultValue = "2025") int year,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(
                VacationBalanceResponse.from(vacationService.getBalance(Long.parseLong(user.getCompanyId()), user.getId(), year))
        );
    }

    @GetMapping("/requests")
    public ApiResponse<List<VacationRequestResponse>> getMyRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(
                vacationService.getMyRequests(user.getId())
                        .stream()
                        .map(VacationRequestResponse::from)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/team")
    public ApiResponse<List<com.hr.modules.vacation.dto.TeamVacationResponse>> getTeamVacations(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(vacationService.getTeamVacations(user.getId()));
    }


    @PostMapping("/request")
    public ApiResponse<VacationRequestResponse> requestVacation(
            @RequestBody VacationRequestDto dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(
                VacationRequestResponse.from(
                        vacationService.requestVacation(
                                Long.parseLong(user.getCompanyId()), 
                                user.getId(), 
                                dto.getType(), 
                                dto.getStartDate(), 
                                dto.getEndDate(), 
                                dto.getReason()
                        )
                )
        );
    }
}
