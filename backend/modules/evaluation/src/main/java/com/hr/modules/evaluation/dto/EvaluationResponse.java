package com.hr.modules.evaluation.dto;

import com.hr.modules.evaluation.domain.Evaluation;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@Builder
public class EvaluationResponse {
    private Long id;
    private Long cycleId;
    private String cycleTitle;
    private Long targetUserId;
    private BigDecimal totalScore;
    private String finalGrade;
    private Evaluation.EvaluationStatus status;

    public static EvaluationResponse from(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .cycleId(evaluation.getCycleId())
                .cycleTitle(evaluation.getCycleTitle())
                .targetUserId(evaluation.getTargetUserId())
                .totalScore(evaluation.getTotalScore())
                .finalGrade(evaluation.getFinalGrade())
                .status(evaluation.getStatus())
                .build();
    }
}
