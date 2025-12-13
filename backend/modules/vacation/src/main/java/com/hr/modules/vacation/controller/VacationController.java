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
            @RequestParam Long userId // Mocking UserContext
    ) {
        Long companyId = 1L; // Mock
        return ApiResponse.success(vacationService.getBalance(companyId, userId, year));
    }

    @GetMapping("/requests")
    public ApiResponse<List<VacationRequest>> getMyRequests(@RequestParam Long userId) {
        return ApiResponse.success(vacationService.getMyRequests(userId));
    }

    @PostMapping("/request")
    public ApiResponse<VacationRequest> requestVacation(
            @RequestBody VacationRequestDto dto,
            @RequestParam Long userId // Mocking UserContext
    ) {
        Long companyId = 1L; // Mock
        return ApiResponse.success(
                vacationService.requestVacation(
                        companyId, 
                        userId, 
                        dto.getType(), 
                        dto.getStartDate(), 
                        dto.getEndDate(), 
                        dto.getReason()
                )
        );
    }
}
