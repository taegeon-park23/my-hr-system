package com.hr.modules.payroll.dto;

import com.hr.modules.payroll.domain.Payroll;
import com.hr.modules.payroll.domain.Payslip;
import com.hr.modules.payroll.domain.PayslipItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class PayrollDTO {

    @Data
    @Builder
    public static class CreateRequest {
        private String title;
        private String targetMonth; // YYYY-MM
        private LocalDate paymentDate;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String targetMonth;
        private LocalDate paymentDate;
        private String status;
        private BigDecimal totalAmount;

        public static Response from(Payroll payroll) {
            return Response.builder()
                    .id(payroll.getId())
                    .title(payroll.getTitle())
                    .targetMonth(payroll.getTargetMonth())
                    .paymentDate(payroll.getPaymentDate())
                    .status(payroll.getStatus().name())
                    .totalAmount(payroll.getTotalAmount())
                    .build();
        }
    }

    @Data
    @Builder
    public static class PayslipResponse {
        private Long id;
        private String userName;
        private String departmentName;
        private BigDecimal baseSalary;
        private BigDecimal totalAllowance;
        private BigDecimal totalDeduction;
        private BigDecimal netAmount;
        private List<ItemResponse> items;
        
        // Payroll Meta info
        private String payrollTitle;
        private String targetMonth;

        public static PayslipResponse from(Payslip payslip) {
            return PayslipResponse.builder()
                    .id(payslip.getId())
                    .userName(payslip.getUserName())
                    .departmentName(payslip.getDepartmentName())
                    .baseSalary(payslip.getBaseSalary())
                    .totalAllowance(payslip.getTotalAllowance())
                    .totalDeduction(payslip.getTotalDeduction())
                    .netAmount(payslip.getNetAmount())
                    .items(payslip.getItems().stream().map(ItemResponse::from).collect(Collectors.toList()))
                    .payrollTitle(payslip.getPayroll().getTitle())
                    .targetMonth(payslip.getPayroll().getTargetMonth())
                    .build();
        }
    }

    @Data
    @Builder
    public static class ItemResponse {
        private String itemType;
        private String itemName;
        private BigDecimal amount;

        public static ItemResponse from(PayslipItem item) {
            return ItemResponse.builder()
                    .itemType(item.getItemType().name())
                    .itemName(item.getItemName())
                    .amount(item.getAmount())
                    .build();
        }
    }
}
