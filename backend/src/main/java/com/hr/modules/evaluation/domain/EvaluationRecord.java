package com.hr.modules.evaluation.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_records")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EvaluationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @Column(name = "rater_user_id", nullable = false)
    private Long raterUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "rater_type", nullable = false)
    private RaterType raterType;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal score = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum RaterType {
        SELF, PEER, MANAGER
    }

    public void submit(BigDecimal score, String comment) {
        this.score = score;
        this.comment = comment;
        this.submittedAt = LocalDateTime.now();
    }
}
