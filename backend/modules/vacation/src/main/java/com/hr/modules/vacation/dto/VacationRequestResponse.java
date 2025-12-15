package com.hr.modules.vacation.dto;

import com.hr.modules.vacation.domain.VacationRequest;
import com.hr.modules.vacation.domain.VacationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class VacationRequestResponse {
    private Long id;
    private VacationType vacationType;
    private LocalDate startDate;
    private LocalDate endDate;
    private double requestDays;
    private String reason;
    private String status;
    private LocalDateTime createdAt;

    public static VacationRequestResponse from(VacationRequest request) {
        return VacationRequestResponse.builder()
                .id(request.getId())
                .vacationType(request.getVacationType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .requestDays(request.getRequestDays())
                .reason(request.getReason())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
