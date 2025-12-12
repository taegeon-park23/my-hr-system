package com.hr.payroll.repository;

import com.hr.payroll.domain.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByCompanyIdAndUserIdAndYear(Long companyId, Long userId, int year);
    Optional<Payroll> findByCompanyIdAndUserIdAndYearAndMonth(Long companyId, Long userId, int year, int month);
}
