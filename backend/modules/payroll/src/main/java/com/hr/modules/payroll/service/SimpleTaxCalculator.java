package com.hr.modules.payroll.service;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class SimpleTaxCalculator implements TaxCalculator {

    // 2024 Simplified Rates (Employee Share)
    private static final BigDecimal NATIONAL_PENSION_RATE = new BigDecimal("0.045"); // 4.5%
    private static final BigDecimal HEALTH_INSURANCE_RATE = new BigDecimal("0.03545"); // 3.545%
    private static final BigDecimal EMPLOYMENT_INSURANCE_RATE = new BigDecimal("0.009"); // 0.9%
    private static final BigDecimal LONG_TERM_CARE_RATE = new BigDecimal("0.1295"); // 12.95% of Health Ins

    @Override
    public BigDecimal calculateIncomeTax(BigDecimal totalAmount) {
        // Simplified Progressive Tax (Monthly Base)
        // 0 ~ 1,166,666 : 6% (But usually exempt under minimum) -> Simplified:
        // For MVP, using a very simplified bracket logic
        double income = totalAmount.doubleValue();
        double tax = 0;

        if (income <= 1200000) {
            tax = income * 0.06; 
        } else if (income <= 3833333) { // ~46M / 12
            tax = 72000 + (income - 1200000) * 0.15;
        } else if (income <= 7333333) { // ~88M / 12
            tax = 467000 + (income - 3833333) * 0.24;
        } else {
            tax = 1307000 + (income - 7333333) * 0.35;
        }
        
        // Apply simplified tax credit (Standard deduction etc ignored for MVP)
        return BigDecimal.valueOf(tax).setScale(0, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal calculateNationalPension(BigDecimal totalAmount) {
        // Max Monthly Income for Pension usually capped (e.g. 5.9M KRW). 
        // Logic: Min(Amount, 5,900,000) * 4.5%
        BigDecimal maxBase = new BigDecimal("5900000");
        BigDecimal base = totalAmount.compareTo(maxBase) > 0 ? maxBase : totalAmount;
        return base.multiply(NATIONAL_PENSION_RATE).setScale(0, RoundingMode.FLOOR);
    }

    @Override
    public BigDecimal calculateHealthInsurance(BigDecimal totalAmount) {
        return totalAmount.multiply(HEALTH_INSURANCE_RATE).setScale(0, RoundingMode.FLOOR);
    }

    @Override
    public BigDecimal calculateEmploymentInsurance(BigDecimal totalAmount) {
        return totalAmount.multiply(EMPLOYMENT_INSURANCE_RATE).setScale(0, RoundingMode.FLOOR);
    }

    @Override
    public BigDecimal calculateLongTermCareInsurance(BigDecimal healthInsurance) {
        return healthInsurance.multiply(LONG_TERM_CARE_RATE).setScale(0, RoundingMode.FLOOR); // 10 won unit cut
    }
}
