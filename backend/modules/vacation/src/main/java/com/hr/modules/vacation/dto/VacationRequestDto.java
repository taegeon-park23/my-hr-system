package com.hr.modules.vacation.dto;

import com.hr.modules.vacation.domain.VacationType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class VacationRequestDto {
    private VacationType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
}
