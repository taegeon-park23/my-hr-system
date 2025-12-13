package com.hr.modules.payroll.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls", indexes = {
    @Index(name = "idx_payroll_tenant", columnList = "tenant_id, company_id, target_month")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "company_id", nullable = false, length = 50)
    private String companyId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "target_month", nullable = false, length = 7) // YYYY-MM
    private String targetMonth;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PayrollStatus {
        DRAFT, CONFIRMED, PAID
    }

    public void updateTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
