package com.hr.modules.evaluation.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations", uniqueConstraints = {
    @UniqueConstraint(name = "uk_eval_target", columnNames = {"cycle_id", "target_user_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private EvaluationCycle cycle;

    @com.fasterxml.jackson.annotation.JsonProperty("cycleId")
    public Long getCycleId() {
        return cycle != null ? cycle.getId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("cycleTitle")
    public String getCycleTitle() {
        return cycle != null ? cycle.getTitle() : null;
    }

    @Column(name = "target_user_id", nullable = false)
    private Long targetUserId;

    @Column(name = "total_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal totalScore = BigDecimal.ZERO;

    @Column(name = "final_grade", length = 10)
    private String finalGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EvaluationStatus status = EvaluationStatus.READY;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EvaluationStatus {
        READY, SELF_EVAL, PEER_EVAL, MANAGER_EVAL, COMPLETED
    }

    public void updateScore(BigDecimal score, String grade) {
        this.totalScore = score;
        this.finalGrade = grade;
    }
    
    public void changeStatus(EvaluationStatus status) {
        this.status = status;
    }
}
