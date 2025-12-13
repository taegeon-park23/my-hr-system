package com.hr.modules.payroll.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "payrolls")
@Getter
@NoArgsConstructor
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "target_year", nullable = false)
    private int year;

    @Column(name = "target_month", nullable = false)
    private int month;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private BigDecimal taxAmount;

    @Column(nullable = false)
    private BigDecimal insuranceAmount;

    @Column(nullable = false)
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status = PayrollStatus.DRAFT;

    public enum PayrollStatus {
        DRAFT, CONFIRMED, PAID
    }

    public Payroll(Long companyId, Long userId, int year, int month, LocalDate paymentDate, BigDecimal totalAmount) {
        this.companyId = companyId;
        this.userId = userId;
        this.year = year;
        this.month = month;
        this.paymentDate = paymentDate;
        this.totalAmount = totalAmount;
        // Simplified calculation initialization
        this.taxAmount = BigDecimal.ZERO;
        this.insuranceAmount = BigDecimal.ZERO;
        this.netAmount = totalAmount;
    }
}

