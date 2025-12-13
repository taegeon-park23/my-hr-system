package com.hr.modules.evaluation.repository;

import com.hr.modules.evaluation.domain.EvaluationCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationCycleRepository extends JpaRepository<EvaluationCycle, Long> {
    List<EvaluationCycle> findByCompanyId(Long companyId);
    List<EvaluationCycle> findByCompanyIdAndStatus(Long companyId, EvaluationCycle.CycleStatus status);
}
