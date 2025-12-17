package com.hr.modules.payroll.service;

import com.hr.modules.payroll.domain.Payslip;
import com.hr.modules.payroll.domain.PayslipItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryCalculationService {

    private final TaxCalculator taxCalculator;
    private static final BigDecimal MEAL_ALLOWANCE = new BigDecimal("200000"); // 2024 Tax Free limit up to 200k

    public void calculate(Payslip payslip) {
        BigDecimal baseSalary = payslip.getBaseSalary();
        
        // 1. Allowance
        payslip.addItem(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.ALLOWANCE)
                .itemName("식대")
                .amount(MEAL_ALLOWANCE)
                .build());
        
        BigDecimal totalAllowance = MEAL_ALLOWANCE;

        // 2. Deduction
        BigDecimal grossIncome = baseSalary.add(totalAllowance);
        
        BigDecimal nationalPension = taxCalculator.calculateNationalPension(grossIncome);
        BigDecimal healthInsurance = taxCalculator.calculateHealthInsurance(grossIncome);
        BigDecimal employmentInsurance = taxCalculator.calculateEmploymentInsurance(grossIncome);
        BigDecimal longTermCare = taxCalculator.calculateLongTermCareInsurance(healthInsurance);
        BigDecimal incomeTax = taxCalculator.calculateIncomeTax(grossIncome); // Simple tax
        // Local Income Tax is 10% of Income Tax
        BigDecimal localIncomeTax = incomeTax.multiply(new BigDecimal("0.1")).setScale(0, java.math.RoundingMode.FLOOR);

        addDeduction(payslip, "국민연금", nationalPension);
        addDeduction(payslip, "건강보험", healthInsurance);
        addDeduction(payslip, "장기요양보험", longTermCare);
        addDeduction(payslip, "고용보험", employmentInsurance);
        addDeduction(payslip, "소득세", incomeTax);
        addDeduction(payslip, "지방소득세", localIncomeTax);

        BigDecimal totalDeduction = nationalPension.add(healthInsurance).add(employmentInsurance)
                .add(longTermCare).add(incomeTax).add(localIncomeTax);

        BigDecimal netAmount = grossIncome.subtract(totalDeduction);

        // 3. Update Entity
        payslip.updateCalculatedAmounts(totalAllowance, totalDeduction, netAmount);
    }
    
    private void addDeduction(Payslip payslip, String name, BigDecimal amount) {
         payslip.addItem(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName(name)
                .amount(amount)
                .build());
    }

    public record CalculationResult(
        BigDecimal totalAllowance,
        BigDecimal totalDeduction,
        BigDecimal netAmount,
        List<PayslipItem> items
    ) {}
    
    public CalculationResult calculateAndGetResult(BigDecimal baseSalary) {
        BigDecimal totalAllowance = MEAL_ALLOWANCE;
        List<PayslipItem> items = new ArrayList<>();
        
        items.add(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.ALLOWANCE)
                .itemName("식대")
                .amount(MEAL_ALLOWANCE)
                .build());

        BigDecimal grossIncome = baseSalary.add(totalAllowance);
        
        BigDecimal nationalPension = taxCalculator.calculateNationalPension(grossIncome);
        BigDecimal healthInsurance = taxCalculator.calculateHealthInsurance(grossIncome);
        BigDecimal employmentInsurance = taxCalculator.calculateEmploymentInsurance(grossIncome);
        BigDecimal longTermCare = taxCalculator.calculateLongTermCareInsurance(healthInsurance);
        BigDecimal incomeTax = taxCalculator.calculateIncomeTax(grossIncome);
        BigDecimal localIncomeTax = incomeTax.multiply(new BigDecimal("0.1")).setScale(0, java.math.RoundingMode.FLOOR);
        
        items.add(createDeduction("국민연금", nationalPension));
        items.add(createDeduction("건강보험", healthInsurance));
        items.add(createDeduction("장기요양보험", longTermCare));
        items.add(createDeduction("고용보험", employmentInsurance));
        items.add(createDeduction("소득세", incomeTax));
        items.add(createDeduction("지방소득세", localIncomeTax));
        
        BigDecimal totalDeduction = nationalPension.add(healthInsurance).add(employmentInsurance)
                .add(longTermCare).add(incomeTax).add(localIncomeTax);
        BigDecimal netAmount = grossIncome.subtract(totalDeduction);
        
        return new CalculationResult(totalAllowance, totalDeduction, netAmount, items);
    }

    private PayslipItem createDeduction(String name, BigDecimal amount) {
        return PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName(name)
                .amount(amount)
                .build();
    }
}
