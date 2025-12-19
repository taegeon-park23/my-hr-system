package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "approval_rules")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ApprovalRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "request_type", nullable = false)
    private String requestType; // VACATION, PAYROLL, ASSET, etc.

    @Column(name = "min_amount")
    private Long minAmount; // For cost-related approvals

    @Column(name = "max_amount")
    private Long maxAmount;

    @Column(name = "approval_line_key", nullable = false)
    private String approvalLineKey; // TEAM_LEADER, DEPT_HEAD, CEO, etc.

    @Column(name = "priority", nullable = false)
    private int priority;
}
