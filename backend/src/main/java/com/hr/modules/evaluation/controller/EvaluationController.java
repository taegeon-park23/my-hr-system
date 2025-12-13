package com.hr.modules.evaluation.controller;

import com.hr.modules.evaluation.domain.Evaluation;
import com.hr.modules.evaluation.domain.EvaluationRecord;
import com.hr.modules.evaluation.dto.SubmitEvaluationRequest;
import com.hr.modules.evaluation.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/my")
    public ResponseEntity<List<Evaluation>> getMyEvaluations(@RequestParam Long userId) {
        return ResponseEntity.ok(evaluationService.getMyEvaluations(userId));
    }

    @GetMapping("/todo")
    public ResponseEntity<List<EvaluationRecord>> getToDoEvaluations(@RequestParam Long userId) {
        return ResponseEntity.ok(evaluationService.getMyToDoEvaluations(userId));
    }

    @PostMapping("/records/{id}/submit")
    public ResponseEntity<EvaluationRecord> submitEvaluation(@PathVariable Long id, @RequestBody SubmitEvaluationRequest request) {
        return ResponseEntity.ok(evaluationService.submitEvaluation(id, request.getScore(), request.getComment()));
    }
}
