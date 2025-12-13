package com.hr.modules.evaluation.repository;

import com.hr.modules.evaluation.domain.EvaluationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRecordRepository extends JpaRepository<EvaluationRecord, Long> {
    List<EvaluationRecord> findByEvaluationId(Long evaluationId);
    List<EvaluationRecord> findByRaterUserId(Long raterUserId);
}
