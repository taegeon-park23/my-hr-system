package com.hr.vacation.repository;

import com.hr.vacation.domain.VacationBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VacationBalanceRepository extends JpaRepository<VacationBalance, Long> {
    Optional<VacationBalance> findByCompanyIdAndUserIdAndYear(Long companyId, Long userId, int year);
}
