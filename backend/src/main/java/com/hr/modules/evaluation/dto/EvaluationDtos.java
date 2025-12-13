package com.hr.modules.evaluation.dto;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class EvaluationCycleDto {
    private Long id;
    private String title;
    private Integer year;
    private EvaluationCycle.CycleType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private EvaluationCycle.CycleStatus status;
}

@Data
public class CreateCycleRequest {
    private Long companyId;
    private String title;
    private Integer year;
    private EvaluationCycle.CycleType type;
    private LocalDate startDate;
    private LocalDate endDate;
}

@Data
public class SubmitEvaluationRequest {
    private BigDecimal score;
    private String comment;
}
