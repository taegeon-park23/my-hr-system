package com.hr.attendance.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_logs")
@Getter
@NoArgsConstructor
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "work_type")
    private String workType; // e.g., "NORMAL", "REMOTE"

    @Column(name = "ip_address")
    private String ipAddress;

    public AttendanceLog(Long companyId, Long userId, LocalDate date, LocalDateTime checkInTime, String workType, String ipAddress) {
        this.companyId = companyId;
        this.userId = userId;
        this.date = date;
        this.checkInTime = checkInTime;
        this.workType = workType;
        this.ipAddress = ipAddress;
    }

    public void checkOut(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
}
