package com.hr.modules.attendance.repository;

import com.hr.modules.attendance.domain.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByCompanyIdAndUserIdAndDateBetween(Long companyId, Long userId, LocalDate startDate, LocalDate endDate);
}

