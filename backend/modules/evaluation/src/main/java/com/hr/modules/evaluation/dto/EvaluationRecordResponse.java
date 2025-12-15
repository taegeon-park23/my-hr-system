package com.hr.modules.evaluation.dto;

import com.hr.modules.evaluation.domain.EvaluationRecord;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class EvaluationRecordResponse {
    private Long id;
    private Long evaluationId;
    private Long raterUserId;
    private EvaluationRecord.RaterType raterType;
    private BigDecimal score;
    private String comment;
    private LocalDateTime submittedAt;

    public static EvaluationRecordResponse from(EvaluationRecord record) {
        return EvaluationRecordResponse.builder()
                .id(record.getId())
                .evaluationId(record.getEvaluation().getId())
                .raterUserId(record.getRaterUserId())
                .raterType(record.getRaterType())
                .score(record.getScore())
                .comment(record.getComment())
                .submittedAt(record.getSubmittedAt())
                .build();
    }
}
