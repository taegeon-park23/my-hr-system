package com.hr.modules.payroll.repository;

import com.hr.modules.payroll.domain.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByCompanyIdOrderByTargetMonthDesc(String companyId);
    Optional<Payroll> findByIdAndCompanyId(Long id, String companyId);
}
