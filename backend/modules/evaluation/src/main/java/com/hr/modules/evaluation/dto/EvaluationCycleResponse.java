package com.hr.modules.evaluation.dto;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class EvaluationCycleResponse {
    private Long id;
    private String title;
    private Integer year;
    private EvaluationCycle.CycleType type;
    private EvaluationCycle.CycleStatus status;
    private LocalDate startDate;
    private LocalDate endDate;

    public static EvaluationCycleResponse from(EvaluationCycle cycle) {
        return EvaluationCycleResponse.builder()
                .id(cycle.getId())
                .title(cycle.getTitle())
                .year(cycle.getYear())
                .type(cycle.getType())
                .status(cycle.getStatus())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .build();
    }
}
