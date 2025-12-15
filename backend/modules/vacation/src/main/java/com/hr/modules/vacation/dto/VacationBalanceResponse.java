package com.hr.modules.vacation.dto;

import com.hr.modules.vacation.domain.VacationBalance;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VacationBalanceResponse {
    private int year;
    private double totalDays;
    private double usedDays;
    private double remainingDays;

    public static VacationBalanceResponse from(VacationBalance balance) {
        return VacationBalanceResponse.builder()
                .year(balance.getYear())
                .totalDays(balance.getTotalDays())
                .usedDays(balance.getUsedDays())
                .remainingDays(balance.getRemainingDays())
                .build();
    }
}
