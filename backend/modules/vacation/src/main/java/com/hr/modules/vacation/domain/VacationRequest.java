package com.hr.modules.vacation.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vacation_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VacationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_type", nullable = false)
    private VacationType vacationType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "request_days", nullable = false)
    private double requestDays;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "approval_request_id")
    private Long approvalRequestId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public VacationRequest(Long companyId, Long userId, VacationType vacationType, 
                           LocalDate startDate, LocalDate endDate, double requestDays, String reason) {
        this.companyId = companyId;
        this.userId = userId;
        this.vacationType = vacationType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.requestDays = requestDays;
        this.reason = reason;
    }

    public void connectApproval(Long approvalRequestId) {
        this.approvalRequestId = approvalRequestId;
    }

    public void updateStatus(String status) {
        this.status = status;
    }
}
