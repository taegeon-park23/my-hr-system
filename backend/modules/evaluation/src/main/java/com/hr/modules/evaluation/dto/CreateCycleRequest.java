package com.hr.modules.evaluation.dto;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateCycleRequest {
    private Long companyId;
    private String title;
    private Integer year;
    private EvaluationCycle.CycleType type;
    private LocalDate startDate;
    private LocalDate endDate;
}
