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
}

