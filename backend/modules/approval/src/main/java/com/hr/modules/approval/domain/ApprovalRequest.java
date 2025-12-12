package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "approval_requests")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ApprovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType; // e.g., VACATION, EXPENSE

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @Column(name = "requester_user_id", nullable = false)
    private Long requesterUserId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "current_step_order")
    private Integer currentStepOrder;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ApprovalStatus status; // PENDING, APPROVED, REJECTED, CANCELED

    @OneToMany(mappedBy = "approvalRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApprovalStep> steps = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ApprovalRequest(Long companyId, String resourceType, Long resourceId, Long requesterUserId, String title) {
        this.companyId = companyId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.requesterUserId = requesterUserId;
        this.title = title;
        this.currentStepOrder = 1;
        this.status = ApprovalStatus.PENDING;
    }

    public void addStep(ApprovalStep step) {
        this.steps.add(step);
        step.setApprovalRequest(this);
    }
    
    public void approve() {
        this.status = ApprovalStatus.APPROVED;
    }
    
    public void reject() {
        this.status = ApprovalStatus.REJECTED;
    }
    
    public void cancel() {
        this.status = ApprovalStatus.CANCELED;
    }

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED, CANCELED
    }
}
