package com.hr.modules.attendance.service;

import com.hr.modules.attendance.domain.AttendanceLog;
import com.hr.modules.attendance.dto.AttendanceRequest;
import com.hr.modules.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public void checkIn(Long userId, Long companyId, AttendanceRequest request) {
        LocalDate today = LocalDate.now();
        
        if (attendanceRepository.findByUserIdAndDate(userId, today).isPresent()) {
            throw new IllegalStateException("Already checked in today");
        }

        AttendanceLog log = new AttendanceLog(
            companyId,
            userId,
            today,
            LocalDateTime.now(),
            request.getWorkType(),
            request.getIpAddress()
        );

        attendanceRepository.save(log);
    }

    public void checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        AttendanceLog log = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new IllegalStateException("No check-in record found for today"));

        log.checkOut(LocalDateTime.now());
    }

    public java.util.List<AttendanceLog> getMyLogs(Long userId) {
        return attendanceRepository.findAllByUserIdOrderByDateDesc(userId);
    }

    public java.util.List<AttendanceLog> getMyLogsByMonth(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);
        return attendanceRepository.findAllByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);
    }

    public com.hr.modules.attendance.dto.AttendanceSummaryResponse getMonthlySummary(Long userId, int year, int month) {
        java.util.List<AttendanceLog> logs = getMyLogsByMonth(userId, year, month);
        
        double totalHours = logs.stream()
                .filter(l -> l.getCheckInTime() != null && l.getCheckOutTime() != null)
                .mapToDouble(l -> java.time.Duration.between(l.getCheckInTime(), l.getCheckOutTime()).toMinutes() / 60.0)
                .sum();

        // In a real system, we'd query Vacation/Holiday modules for late/absent/vacation counts.
        // For this task, we calculate based on logs or return sensible mocks.
        long lateCount = logs.stream()
                .filter(l -> l.getCheckInTime() != null && l.getCheckInTime().getHour() >= 9 && l.getCheckInTime().getMinute() > 0)
                .count();

        return com.hr.modules.attendance.dto.AttendanceSummaryResponse.builder()
                .totalHours(Math.round(totalHours * 10) / 10.0)
                .lateCount(lateCount)
                .absentCount(0) // Logic depends on expected working days
                .vacationUsed(0) // Should join with vacation module
                .build();
    }
}


