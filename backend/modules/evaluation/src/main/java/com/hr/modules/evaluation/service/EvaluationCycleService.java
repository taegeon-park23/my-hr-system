package com.hr.modules.evaluation.service;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import com.hr.modules.evaluation.repository.EvaluationCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluationCycleService {

    private final EvaluationCycleRepository evaluationCycleRepository;

    @Transactional
    public EvaluationCycle createCycle(EvaluationCycle cycle) {
        return evaluationCycleRepository.save(cycle);
    }

    @Transactional
    public EvaluationCycle startCycle(Long cycleId) {
        EvaluationCycle cycle = evaluationCycleRepository.findById(cycleId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation Cycle not found: " + cycleId));
        cycle.open();
        return cycle;
    }
    
    @Transactional
    public EvaluationCycle closeCycle(Long cycleId) {
        EvaluationCycle cycle = evaluationCycleRepository.findById(cycleId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation Cycle not found: " + cycleId));
        cycle.close();
        return cycle;
    }

    public List<EvaluationCycle> getCyclesByCompany(Long companyId) {
        return evaluationCycleRepository.findByCompanyId(companyId);
    }
}
