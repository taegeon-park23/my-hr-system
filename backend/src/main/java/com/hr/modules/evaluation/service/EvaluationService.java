package com.hr.modules.evaluation.service;

import com.hr.modules.evaluation.domain.Evaluation;
import com.hr.modules.evaluation.domain.EvaluationRecord;
import com.hr.modules.evaluation.repository.EvaluationRecordRepository;
import com.hr.modules.evaluation.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final EvaluationRecordRepository evaluationRecordRepository;

    public List<Evaluation> getMyEvaluations(Long userId) {
        return evaluationRepository.findByTargetUserId(userId);
    }

    // This is a simplified version. In a real scenario, we'd need complex logic to find who I need to evaluate.
    // For now, we finding records where 'raterUserId' matches.
    public List<EvaluationRecord> getMyToDoEvaluations(Long raterUserId) {
        return evaluationRecordRepository.findByRaterUserId(raterUserId);
    }

    @Transactional
    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    @Transactional
    public EvaluationRecord submitEvaluation(Long recordId, BigDecimal score, String comment) {
        EvaluationRecord record = evaluationRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation Record not found: " + recordId));
        
        record.submit(score, comment);
        
        // Trigger score update logic on the main evaluation if needed
        updateEvaluationScore(record.getEvaluation());
        
        return record;
    }

    private void updateEvaluationScore(Evaluation evaluation) {
        List<EvaluationRecord> records = evaluationRecordRepository.findByEvaluationId(evaluation.getId());
        
        // Simple average calculation
        BigDecimal totalScore = BigDecimal.ZERO;
        int count = 0;
        for (EvaluationRecord rec : records) {
            if (rec.getScore() != null && rec.getScore().compareTo(BigDecimal.ZERO) > 0) {
                totalScore = totalScore.add(rec.getScore());
                count++;
            }
        }
        
        if (count > 0) {
            BigDecimal average = totalScore.divide(BigDecimal.valueOf(count), 2, java.math.RoundingMode.HALF_UP);
            // Simple grading logic (can be extracted to a strategy)
            String grade = "B";
            if (average.doubleValue() >= 90) grade = "S";
            else if (average.doubleValue() >= 80) grade = "A";
            else if (average.doubleValue() < 70) grade = "C";
            
            evaluation.updateScore(average, grade);
        }
    }
}
