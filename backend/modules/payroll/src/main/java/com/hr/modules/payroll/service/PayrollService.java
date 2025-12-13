package com.hr.modules.payroll.service;

import com.hr.common.security.SecurityUtils;
import com.hr.modules.payroll.domain.Payroll;
import com.hr.modules.payroll.domain.Payslip;
import com.hr.modules.payroll.dto.PayrollDTO;
import com.hr.modules.payroll.repository.PayrollRepository;
import com.hr.modules.payroll.repository.PayslipRepository;
import com.hr.modules.user.api.UserModuleApi;
import com.hr.modules.user.api.UserInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final PayslipRepository payslipRepository;
    private final SalaryCalculationService calculationService;
    private final UserModuleApi userModuleApi; // User 모듈 연동

    // 급여 대장 생성
    @Transactional
    public PayrollDTO.Response createPayroll(PayrollDTO.CreateRequest request) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String tenantId = SecurityUtils.getCurrentTenantId();

        // 1. Payroll Master 생성
        Payroll payroll = Payroll.builder()
                .tenantId(tenantId)
                .companyId(companyId)
                .title(request.getTitle())
                .targetMonth(request.getTargetMonth())
                .paymentDate(request.getPaymentDate())
                .build();
        
        payrollRepository.save(payroll);

        // 2. 대상자 선정 (해당 회사의 모든 재직자)
        List<UserInfoDto> activeUsers = userModuleApi.getUsersByCompanyId(companyId);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. 각 직원별 급여 계산 및 Payslip 생성
        for (UserInfoDto user : activeUsers) {
            // 기본급 임시 처리 (UserInfoDto에 salary 없음)
            BigDecimal baseSalary = new BigDecimal("3000000"); // TODO: Fetch from User attributes or contract

            var result = calculationService.calculateAndGetResult(baseSalary);

            Payslip payslip = Payslip.builder()
                    .payroll(payroll)
                    .userId(user.getUserId())
                    .userName(user.getName())
                    .departmentName("N/A") // UserInfoDto misses deptName
                    .baseSalary(baseSalary)
                    .totalAllowance(result.totalAllowance())
                    .totalDeduction(result.totalDeduction())
                    .netAmount(result.netAmount())
                    .build();

            // 아이템 추가
            result.items().forEach(payslip::addItem);
            
            payslipRepository.save(payslip);
            totalAmount = totalAmount.add(result.netAmount());
        }

        // 4. 총액 업데이트
        payroll.updateTotalAmount(totalAmount);
        
        return PayrollDTO.Response.from(payroll);
    }

    public List<PayrollDTO.Response> getPayrolls() {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return payrollRepository.findByCompanyIdOrderByTargetMonthDesc(companyId)
                .stream()
                .map(PayrollDTO.Response::from)
                .collect(Collectors.toList());
    }

    public PayrollDTO.Response getPayrollDetail(Long id) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        Payroll payroll = payrollRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new IllegalArgumentException("Payroll not found"));
        return PayrollDTO.Response.from(payroll);
    }

    public List<PayrollDTO.PayslipResponse> getPayslips(Long payrollId) {
        return payslipRepository.findByPayrollId(payrollId)
                .stream()
                .map(PayrollDTO.PayslipResponse::from)
                .collect(Collectors.toList());
    }

    public List<PayrollDTO.PayslipResponse> getMyPayslips() {
        Long userId = SecurityUtils.getCurrentUserId();
        String companyId = SecurityUtils.getCurrentCompanyId();
        
        return payslipRepository.findAllByUserIdAndCompanyId(userId, companyId)
                .stream()
                .map(PayrollDTO.PayslipResponse::from)
                .collect(Collectors.toList());
    }

    public PayrollDTO.PayslipResponse getPayslipDetail(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Payslip payslip = payslipRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Payslip not found"));
        return PayrollDTO.PayslipResponse.from(payslip);
    }
}
