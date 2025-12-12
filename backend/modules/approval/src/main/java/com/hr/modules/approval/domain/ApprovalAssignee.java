package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "approval_assignees")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApprovalAssignee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approval_step_id")
    private ApprovalStep approvalStep;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AssigneeStatus status;
    
    @Column(length = 500)
    private String comment;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    public ApprovalAssignee(Long userId) {
        this.userId = userId;
        this.status = AssigneeStatus.PENDING;
    }
    
    public void approve(String comment) {
        this.status = AssigneeStatus.APPROVED;
        this.comment = comment;
        this.processedAt = LocalDateTime.now();
    }
    
    public void reject(String comment) {
        this.status = AssigneeStatus.REJECTED;
        this.comment = comment;
        this.processedAt = LocalDateTime.now();
    }

    public enum AssigneeStatus {
        PENDING, APPROVED, REJECTED
    }
}
