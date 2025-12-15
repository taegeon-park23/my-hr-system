package com.hr.modules.evaluation.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.evaluation.domain.EvaluationCycle;
import com.hr.modules.evaluation.dto.CreateCycleRequest;
import com.hr.modules.evaluation.dto.EvaluationCycleResponse;
import com.hr.modules.evaluation.service.EvaluationCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/evaluations/cycles")
@RequiredArgsConstructor
public class EvaluationAdminController {

    private final EvaluationCycleService evaluationCycleService;

    @PostMapping
    public ApiResponse<EvaluationCycleResponse> createCycle(@RequestBody CreateCycleRequest request) {
        // Entity creation generally belongs in Service/Mapper, kept here for safe refactoring scope
        EvaluationCycle cycle = EvaluationCycle.builder()
                .companyId(request.getCompanyId())
                .title(request.getTitle())
                .year(request.getYear())
                .type(request.getType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
                
        return ApiResponse.success(
                EvaluationCycleResponse.from(evaluationCycleService.createCycle(cycle))
        );
    }

    @GetMapping
    public ApiResponse<List<EvaluationCycleResponse>> getCycles(@RequestParam Long companyId) {
        return ApiResponse.success(
                evaluationCycleService.getCyclesByCompany(companyId)
                        .stream()
                        .map(EvaluationCycleResponse::from)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping("/{id}/start")
    public ApiResponse<EvaluationCycleResponse> startCycle(@PathVariable Long id) {
        return ApiResponse.success(
                EvaluationCycleResponse.from(evaluationCycleService.startCycle(id))
        );
    }
    
    @PostMapping("/{id}/close")
    public ApiResponse<EvaluationCycleResponse> closeCycle(@PathVariable Long id) {
        return ApiResponse.success(
                EvaluationCycleResponse.from(evaluationCycleService.closeCycle(id))
        );
    }
}
