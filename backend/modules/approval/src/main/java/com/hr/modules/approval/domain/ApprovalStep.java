package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval_steps")
public class ApprovalStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ApprovalRequest request;

    @Column(name = "approver_id", nullable = false)
    private Long approverId;

    @Column(name = "step_order", nullable = false)
    private int stepOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.WAITING;

    @Column(name = "comment")
    private String comment;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Version
    private Long version;

    public enum ApprovalStatus {
        WAITING, PENDING, APPROVED, REJECTED, CANCELED
    }

    protected ApprovalStep() {}

    public ApprovalStep(ApprovalRequest request, Long approverId, int stepOrder) {
        this.request = request;
        this.approverId = approverId;
        this.stepOrder = stepOrder;
        this.status = (stepOrder == 1) ? ApprovalStatus.PENDING : ApprovalStatus.WAITING;
    }

    public void activate() {
        if (this.status == ApprovalStatus.WAITING) {
            this.status = ApprovalStatus.PENDING;
        }
    }

    public void approve(String comment) {
        this.status = ApprovalStatus.APPROVED;
        this.comment = comment;
        this.processedAt = LocalDateTime.now();
    }

    public void reject(String comment) {
        this.status = ApprovalStatus.REJECTED;
        this.comment = comment;
        this.processedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = ApprovalStatus.CANCELED;
    }

    // Manual Getters
    public Long getId() { return id; }
    public ApprovalRequest getRequest() { return request; }
    public Long getApproverId() { return approverId; }
    public int getStepOrder() { return stepOrder; }
    public ApprovalStatus getStatus() { return status; }
    public String getComment() { return comment; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public Long getVersion() { return version; }
}
