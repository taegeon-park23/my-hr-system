package com.hr.modules.evaluation.repository;

import com.hr.modules.evaluation.domain.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByCycle_Id(Long cycleId);
    Optional<Evaluation> findByCycle_IdAndTargetUserId(Long cycleId, Long targetUserId);
    List<Evaluation> findByTargetUserId(Long targetUserId);
}
