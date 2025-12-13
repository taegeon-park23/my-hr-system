package com.hr.modules.payroll.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.payroll.dto.PayrollDTO;
import com.hr.modules.payroll.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Payroll", description = "급여 관리 API")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @Operation(summary = "급여 대장 생성 (초안)", description = "특정 월의 급여 대장을 생성하고 계산합니다.")
    @PostMapping("/payrolls")
    public ApiResponse<PayrollDTO.Response> createPayroll(@RequestBody PayrollDTO.CreateRequest request) {
        return ApiResponse.success(payrollService.createPayroll(request));
    }

    @Operation(summary = "급여 대장 목록 조회")
    @GetMapping("/payrolls")
    public ApiResponse<List<PayrollDTO.Response>> getPayrolls() {
        return ApiResponse.success(payrollService.getPayrolls());
    }

    @Operation(summary = "급여 대장 상세 조회")
    @GetMapping("/payrolls/{id}")
    public ApiResponse<PayrollDTO.Response> getPayroll(@PathVariable Long id) {
        return ApiResponse.success(payrollService.getPayrollDetail(id));
    }

    @Operation(summary = "급여 대장 내 전체 명세 조회 (관리자)")
    @GetMapping("/payrolls/{payrollId}/payslips")
    public ApiResponse<List<PayrollDTO.PayslipResponse>> getPayslips(@PathVariable Long payrollId) {
        return ApiResponse.success(payrollService.getPayslips(payrollId));
    }

    @Operation(summary = "내 급여 명세 목록 조회 (사용자)")
    @GetMapping("/my-payslips")
    public ApiResponse<List<PayrollDTO.PayslipResponse>> getMyPayslips() {
        return ApiResponse.success(payrollService.getMyPayslips());
    }

    @Operation(summary = "급여 명세 상세 조회")
    @GetMapping("/payslips/{id}")
    public ApiResponse<PayrollDTO.PayslipResponse> getPayslip(@PathVariable Long id) {
        return ApiResponse.success(payrollService.getPayslipDetail(id));
    }
}
