package com.hr.modules.payroll.service;

import java.math.BigDecimal;

public interface TaxCalculator {
    BigDecimal calculateIncomeTax(BigDecimal totalAmount);
    BigDecimal calculateNationalPension(BigDecimal totalAmount);
    BigDecimal calculateHealthInsurance(BigDecimal totalAmount);
    BigDecimal calculateEmploymentInsurance(BigDecimal totalAmount);
    BigDecimal calculateLongTermCareInsurance(BigDecimal healthInsurance);
}
