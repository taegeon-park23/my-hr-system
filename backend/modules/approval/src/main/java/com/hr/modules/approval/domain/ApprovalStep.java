package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "approval_steps")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApprovalStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approval_request_id")
    private ApprovalRequest approvalRequest;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;
    
    @Column(nullable = false, length = 100)
    private String name; // e.g., "팀장 승인", "부서장 승인"

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StepStatus status;

    @OneToMany(mappedBy = "approvalStep", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApprovalAssignee> assignees = new ArrayList<>();

    public ApprovalStep(Integer stepOrder, String name) {
        this.stepOrder = stepOrder;
        this.name = name;
        this.status = StepStatus.PENDING;
    }

    public void addAssignee(ApprovalAssignee assignee) {
        this.assignees.add(assignee);
        assignee.setApprovalStep(this);
    }
    
    public void complete() {
        this.status = StepStatus.COMPLETED;
    }
    
    public void reject() {
        this.status = StepStatus.REJECTED;
    }

    public enum StepStatus {
        PENDING, COMPLETED, REJECTED
    }
}
