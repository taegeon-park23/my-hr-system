package com.hr.modules.approval.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval_requests")
@Getter
@NoArgsConstructor
public class ApprovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED
    }

    public ApprovalRequest(Long companyId, Long requesterId, String title, String content) {
        this.companyId = companyId;
        this.requesterId = requesterId;
        this.title = title;
        this.content = content;
    }
}

