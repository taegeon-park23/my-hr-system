package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "approval_requests")
public class ApprovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @Column(name = "requester_user_id", nullable = false)
    private Long requesterUserId;

    @Column(nullable = false)
    private String title;

    @Column(name = "current_step_order")
    private Integer currentStepOrder = 1;

    @Column(nullable = false)
    private String status = "PENDING";

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<ApprovalStep> steps = new ArrayList<>();

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ApprovalRequest() {}

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addStep(Long approverId) {
        int nextOrder = steps.size() + 1;
        this.steps.add(new ApprovalStep(this, approverId, nextOrder));
    }

    public void approve() {
        this.status = "APPROVED";
    }

    public void reject() {
        this.status = "REJECTED";
        this.steps.forEach(step -> {
            if (step.getStatus() == ApprovalStep.ApprovalStatus.WAITING || step.getStatus() == ApprovalStep.ApprovalStatus.PENDING) {
                step.cancel();
            }
        });
    }

    public void cancel() {
        this.status = "CANCELED";
        this.steps.forEach(ApprovalStep::cancel);
    }

    // Manual Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }
    public Long getRequesterUserId() { return requesterUserId; }
    public void setRequesterUserId(Long requesterUserId) { this.requesterUserId = requesterUserId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getCurrentStepOrder() { return currentStepOrder; }
    public void setCurrentStepOrder(Integer currentStepOrder) { this.currentStepOrder = currentStepOrder; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<ApprovalStep> getSteps() { return steps; }
    public void setSteps(List<ApprovalStep> steps) { this.steps = steps; }
    public Long getVersion() { return version; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
