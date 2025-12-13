package com.hr.modules.payroll.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payslip_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PayslipItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payslip_id", nullable = false)
    private Payslip payslip;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 20)
    private ItemType itemType;

    @Column(name = "item_name", nullable = false, length = 50)
    private String itemName;

    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal amount = BigDecimal.ZERO;

    public enum ItemType {
        ALLOWANCE, DEDUCTION
    }
}
