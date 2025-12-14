package com.hr.modules.evaluation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.evaluation.domain.Evaluation;
import com.hr.modules.evaluation.domain.EvaluationRecord;
import com.hr.modules.evaluation.dto.SubmitEvaluationRequest;
import com.hr.modules.evaluation.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/my")
    public ApiResponse<List<Evaluation>> getMyEvaluations(@RequestParam Long userId) {
        return ApiResponse.success(evaluationService.getMyEvaluations(userId));
    }

    @GetMapping("/todo")
    public ApiResponse<List<EvaluationRecord>> getToDoEvaluations(@RequestParam Long userId) {
        return ApiResponse.success(evaluationService.getMyToDoEvaluations(userId));
    }

    @PostMapping("/records/{id}/submit")
    public ApiResponse<EvaluationRecord> submitEvaluation(@PathVariable Long id, @RequestBody SubmitEvaluationRequest request) {
        return ApiResponse.success(evaluationService.submitEvaluation(id, request.getScore(), request.getComment()));
    }
}
