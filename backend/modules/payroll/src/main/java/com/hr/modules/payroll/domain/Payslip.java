package com.hr.modules.payroll.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payslips", indexes = {
    @Index(name = "idx_payslip_user", columnList = "user_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_id", nullable = false)
    private Payroll payroll;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Column(name = "base_salary", nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal baseSalary = BigDecimal.ZERO;

    @Column(name = "total_allowance", nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal totalAllowance = BigDecimal.ZERO;

    @Column(name = "total_deduction", nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal totalDeduction = BigDecimal.ZERO;

    @Column(name = "net_amount", nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal netAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "payslip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PayslipItem> items = new ArrayList<>();

    public void addItem(PayslipItem item) {
        items.add(item);
        item.setPayslip(this);
    }

    public void updateCalculatedAmounts(BigDecimal totalAllowance, BigDecimal totalDeduction, BigDecimal netAmount) {
        this.totalAllowance = totalAllowance;
        this.totalDeduction = totalDeduction;
        this.netAmount = netAmount;
    }
}
