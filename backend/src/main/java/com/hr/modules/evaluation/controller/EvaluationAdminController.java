package com.hr.modules.evaluation.controller;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import com.hr.modules.evaluation.dto.CreateCycleRequest;
import com.hr.modules.evaluation.service.EvaluationCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/evaluations/cycles")
@RequiredArgsConstructor
public class EvaluationAdminController {

    private final EvaluationCycleService evaluationCycleService;

    @PostMapping
    public ResponseEntity<EvaluationCycle> createCycle(@RequestBody CreateCycleRequest request) {
        EvaluationCycle cycle = EvaluationCycle.builder()
                .companyId(request.getCompanyId())
                .title(request.getTitle())
                .year(request.getYear())
                .type(request.getType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return ResponseEntity.ok(evaluationCycleService.createCycle(cycle));
    }

    @GetMapping
    public ResponseEntity<List<EvaluationCycle>> getCycles(@RequestParam Long companyId) {
        return ResponseEntity.ok(evaluationCycleService.getCyclesByCompany(companyId));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<EvaluationCycle> startCycle(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationCycleService.startCycle(id));
    }
    
    @PostMapping("/{id}/close")
    public ResponseEntity<EvaluationCycle> closeCycle(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationCycleService.closeCycle(id));
    }
}
