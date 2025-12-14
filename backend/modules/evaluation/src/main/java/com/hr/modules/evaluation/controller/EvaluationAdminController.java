package com.hr.modules.evaluation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.evaluation.domain.EvaluationCycle;
import com.hr.modules.evaluation.dto.CreateCycleRequest;
import com.hr.modules.evaluation.service.EvaluationCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/evaluations/cycles")
@RequiredArgsConstructor
public class EvaluationAdminController {

    private final EvaluationCycleService evaluationCycleService;

    @PostMapping
    public ApiResponse<EvaluationCycle> createCycle(@RequestBody CreateCycleRequest request) {
        EvaluationCycle cycle = EvaluationCycle.builder()
                .companyId(request.getCompanyId())
                .title(request.getTitle())
                .year(request.getYear())
                .type(request.getType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return ApiResponse.success(evaluationCycleService.createCycle(cycle));
    }

    @GetMapping
    public ApiResponse<List<EvaluationCycle>> getCycles(@RequestParam Long companyId) {
        return ApiResponse.success(evaluationCycleService.getCyclesByCompany(companyId));
    }

    @PostMapping("/{id}/start")
    public ApiResponse<EvaluationCycle> startCycle(@PathVariable Long id) {
        return ApiResponse.success(evaluationCycleService.startCycle(id));
    }
    
    @PostMapping("/{id}/close")
    public ApiResponse<EvaluationCycle> closeCycle(@PathVariable Long id) {
        return ApiResponse.success(evaluationCycleService.closeCycle(id));
    }
}
