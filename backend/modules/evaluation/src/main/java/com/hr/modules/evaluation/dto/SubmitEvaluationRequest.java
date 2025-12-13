package com.hr.modules.evaluation.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubmitEvaluationRequest {
    private BigDecimal score;
    private String comment;
}
