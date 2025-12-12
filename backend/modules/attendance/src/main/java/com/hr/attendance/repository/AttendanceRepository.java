package com.hr.attendance.repository;

import com.hr.attendance.domain.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceLog, Long> {
    Optional<AttendanceLog> findByUserIdAndDate(Long userId, LocalDate date);
}
