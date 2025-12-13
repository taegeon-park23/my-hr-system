package com.hr.modules.vacation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vacation_balances")
@Getter
@NoArgsConstructor
public class VacationBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "target_year", nullable = false)
    private int year;

    @Column(name = "total_days", nullable = false)
    private double totalDays;

    @Column(name = "used_days", nullable = false)
    private double usedDays;

    public VacationBalance(Long companyId, Long userId, int year, double totalDays) {
        this.companyId = companyId;
        this.userId = userId;
        this.year = year;
        this.totalDays = totalDays;
        this.usedDays = 0;
    }
}

