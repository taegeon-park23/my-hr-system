package com.hr.modules.vacation.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class TeamVacationResponse {
    private String userName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
}
