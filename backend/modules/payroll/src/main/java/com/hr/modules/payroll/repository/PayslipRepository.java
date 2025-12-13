package com.hr.modules.payroll.repository;

import com.hr.modules.payroll.domain.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    
    // 특정 급여 대장의 모든 명세서 (관리자용)
    List<Payslip> findByPayrollId(Long payrollId);

    // 내 명세서 조회 (사용자용) - 참여자의 회사 ID 검증은 Service에서 Payroll을 통해 간접 확인
    @Query("SELECT p FROM Payslip p JOIN FETCH p.payroll pr WHERE p.userId = :userId AND pr.companyId = :companyId ORDER BY pr.targetMonth DESC")
    List<Payslip> findAllByUserIdAndCompanyId(@Param("userId") Long userId, @Param("companyId") String companyId);

    // 단일 명세 상세 조회 (본인 확인용)
    Optional<Payslip> findByIdAndUserId(Long id, Long userId);
}
