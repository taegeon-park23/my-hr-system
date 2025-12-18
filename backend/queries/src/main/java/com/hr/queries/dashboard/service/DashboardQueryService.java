package com.hr.queries.dashboard.service;

import com.hr.queries.dashboard.dto.DashboardSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardQueryService {

    private final JdbcTemplate jdbcTemplate;

    public DashboardSummaryDto getSummary(Long companyId) {
        // 1. Total Employees
        Long totalEmployees = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE company_id = ?",
                Long.class, companyId);

        // 2. Approval Status Counts
        Long pendingApprovals = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM approval_requests WHERE company_id = ? AND status = 'PENDING'",
                Long.class, companyId);

        Long approvedApprovals = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM approval_requests WHERE company_id = ? AND status = 'APPROVED'",
                Long.class, companyId);

        Long rejectedApprovals = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM approval_requests WHERE company_id = ? AND status = 'REJECTED'",
                Long.class, companyId);

        // 3. Today's Attendance
        Long todayAttendance = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM attendance_logs WHERE company_id = ? AND date = ?",
                Long.class, companyId, LocalDate.now());

        return DashboardSummaryDto.builder()
                .totalEmployees(totalEmployees != null ? totalEmployees : 0L)
                .pendingApprovals(pendingApprovals != null ? pendingApprovals : 0L)
                .approvedApprovals(approvedApprovals != null ? approvedApprovals : 0L)
                .rejectedApprovals(rejectedApprovals != null ? rejectedApprovals : 0L)
                .todayAttendance(todayAttendance != null ? todayAttendance : 0L)
                .build();
    }

    public java.util.List<com.hr.queries.dashboard.dto.DepartmentStatDto> getDepartmentStats(Long companyId) {
        String sql = "SELECT d.id, d.name, COUNT(u.id) as emp_count " +
                     "FROM departments d " +
                     "LEFT JOIN users u ON d.id = u.dept_id " +
                     "WHERE d.company_id = ? " +
                     "GROUP BY d.id, d.name";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> com.hr.queries.dashboard.dto.DepartmentStatDto.builder()
                .deptId(rs.getLong("id"))
                .deptName(rs.getString("name"))
                .employeeCount(rs.getLong("emp_count"))
                .build(), companyId);
    }
}
