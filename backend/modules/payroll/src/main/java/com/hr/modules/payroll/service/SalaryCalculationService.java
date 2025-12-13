package com.hr.modules.payroll.service;

import com.hr.modules.payroll.domain.Payslip;
import com.hr.modules.payroll.domain.PayslipItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SalaryCalculationService {

    /**
     * 단순 계산 로직 (MVP: 고정급 처리)
     * 추후 Attendance 모듈 연동 및 복잡한 세금 계산 로직 추가 필요
     */
    public void calculate(Payslip payslip) {
        BigDecimal baseSalary = payslip.getBaseSalary();
        
        // 1. 수당 계산 (MVP: 식대 10만원 고정)
        BigDecimal mealAllowance = new BigDecimal("100000");
        payslip.addItem(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.ALLOWANCE)
                .itemName("식대")
                .amount(mealAllowance)
                .build());
        
        BigDecimal totalAllowance = mealAllowance;

        // 2. 공제 계산 (MVP: 소득세 3.3% + 4대보험 약식 10% 가정)
        // 실제로는 과세 표준 구간 및 부양가족 수 등에 따른 복잡한 계산 필요
        BigDecimal grossIncome = baseSalary.add(totalAllowance);
        
        BigDecimal incomeTax = grossIncome.multiply(new BigDecimal("0.033")); // 약식
        BigDecimal insurance = grossIncome.multiply(new BigDecimal("0.09")); // 국민연금, 건보료 등 합산 약식
        
        payslip.addItem(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName("소득세/지방소득세")
                .amount(incomeTax)
                .build());
        
        payslip.addItem(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName("4대보험료")
                .amount(insurance)
                .build());

        BigDecimal totalDeduction = incomeTax.add(insurance);

        // 3. 최종 금액 집계 (Setter가 없으므로 Reflection or Builder로 생성해야 하나, 
        // Payslip Entity에 비즈니스 로직 메서드를 추가하거나(@Setter 지양), 
        // 여기서는 MVP 편의상 Reflection으로 값을 주입할 수 없으니 
        // **Entity에 갱신용 메서드를 추가**하는 것이 맞음.
        // 현재 Entity에는 Setter가 없으므로 updateCalculatedFields 메서드를 만들어야 함.
        // 하지만 이미 Entity를 만들었으므로, 일단 빌더 패턴으로 생성 시점에 계산해서 넣는 방식을 쓰거나
        // Entity 수정이 필요함. -> Service 로직 완성을 위해 Entity 수정 우선 진행 필요.
        // 이번 턴에서는 수정을 못하므로, 일단 계산 값을 리턴하고 호출측에서 주입하도록 하거나 
        // Payslip 객체 생성 시점에 계산.
        
        // 여기서는 **값 객체 반환** 형태로 구현
    }

    // 계산 결과를 담을 VO
    public record CalculationResult(
        BigDecimal totalAllowance,
        BigDecimal totalDeduction,
        BigDecimal netAmount,
        java.util.List<PayslipItem> items
    ) {}
    
    public CalculationResult calculateAndGetResult(BigDecimal baseSalary) {
        // 1. 수당
        BigDecimal mealAllowance = new BigDecimal("100000");
        var items = new java.util.ArrayList<PayslipItem>();
        
        items.add(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.ALLOWANCE)
                .itemName("식대")
                .amount(mealAllowance)
                .build());
        
        BigDecimal totalAllowance = mealAllowance;

        // 2. 공제
        BigDecimal grossIncome = baseSalary.add(totalAllowance);
        BigDecimal incomeTax = grossIncome.multiply(new BigDecimal("0.033")).setScale(0, java.math.RoundingMode.HALF_UP);
        BigDecimal insurance = grossIncome.multiply(new BigDecimal("0.09")).setScale(0, java.math.RoundingMode.HALF_UP);
        
        items.add(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName("소득세/지방소득세")
                .amount(incomeTax)
                .build());
        
        items.add(PayslipItem.builder()
                .itemType(PayslipItem.ItemType.DEDUCTION)
                .itemName("4대보험료")
                .amount(insurance)
                .build());
        
        BigDecimal totalDeduction = incomeTax.add(insurance);
        BigDecimal netAmount = grossIncome.subtract(totalDeduction);
        
        return new CalculationResult(totalAllowance, totalDeduction, netAmount, items);
    }
}
