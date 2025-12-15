package com.hr.modules.evaluation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import com.hr.modules.evaluation.dto.EvaluationRecordResponse;
import com.hr.modules.evaluation.dto.EvaluationResponse;
import com.hr.modules.evaluation.dto.SubmitEvaluationRequest;
import com.hr.modules.evaluation.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/my")
    public ApiResponse<List<EvaluationResponse>> getMyEvaluations(@AuthenticationPrincipal UserPrincipal user) {
        return ApiResponse.success(
            evaluationService.getMyEvaluations(user.getId())
                    .stream()
                    .map(EvaluationResponse::from)
                    .collect(Collectors.toList())
        );
    }

    @GetMapping("/todo")
    public ApiResponse<List<EvaluationRecordResponse>> getToDoEvaluations(@AuthenticationPrincipal UserPrincipal user) {
        return ApiResponse.success(
            evaluationService.getMyToDoEvaluations(user.getId())
                    .stream()
                    .map(EvaluationRecordResponse::from)
                    .collect(Collectors.toList())
        );
    }

    @PostMapping("/records/{id}/submit")
    public ApiResponse<EvaluationRecordResponse> submitEvaluation(
            @PathVariable Long id, 
            @RequestBody SubmitEvaluationRequest request
    ) {
        return ApiResponse.success(
            EvaluationRecordResponse.from(
                evaluationService.submitEvaluation(id, request.getScore(), request.getComment())
            )
        );
    }
}
