package com.hr.queries.dashboard;

import com.hr.queries.dashboard.dto.DashboardSummaryDto;
import com.hr.queries.dashboard.service.DashboardQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = com.hr.app.HrSystemApplication.class)
@Transactional
public class DashboardQueryTest {

    @Autowired
    private DashboardQueryService dashboardQueryService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        jdbcTemplate.execute("ALTER TABLE approval_steps MODIFY COLUMN status VARCHAR(20)");
    }

    @Test
    void testDashboardSummary() {
        // Given
        Long companyId = 999L;
        
        // Insert dummy company to satisfy FK
        jdbcTemplate.update("INSERT INTO companies (id, name, domain, created_at) VALUES (?, ?, ?, NOW())",
                companyId, "Test Co", "test.com");
        
        // Insert dummy data
        jdbcTemplate.update("INSERT INTO users (company_id, email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                companyId, "user1@test.com", "hash", "User 1", "USER");
        jdbcTemplate.update("INSERT INTO users (company_id, email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                companyId, "user2@test.com", "hash", "User 2", "USER");

        jdbcTemplate.update("INSERT INTO approval_requests (company_id, resource_type, resource_id, requester_user_id, title, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
                companyId, "GENERAL", 1L, 1L, "Req 1", "PENDING");
        
        // When
        DashboardSummaryDto summary = dashboardQueryService.getSummary(companyId);

        // Then
        assertThat(summary.getTotalEmployees()).isEqualTo(2);
        assertThat(summary.getPendingApprovals()).isEqualTo(1);
    }

    @Test
    void testDepartmentStats() {
        // Given
        Long companyId = 888L;
        jdbcTemplate.update("INSERT INTO companies (id, name, domain, created_at) VALUES (?, ?, ?, NOW())",
                companyId, "Stat Co", "stat.com");
        
        jdbcTemplate.update("INSERT INTO departments (company_id, name, depth) VALUES (?, ?, ?)",
                companyId, "Sales", 0);
        Long salesId = jdbcTemplate.queryForObject("SELECT id FROM departments WHERE name = 'Sales' AND company_id = ?", Long.class, companyId);
        
        jdbcTemplate.update("INSERT INTO users (company_id, email, password_hash, name, role, dept_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
                companyId, "saler@test.com", "hash", "Saler", "USER", salesId);

        // When
        java.util.List<com.hr.queries.dashboard.dto.DepartmentStatDto> stats = dashboardQueryService.getDepartmentStats(companyId);

        // Then
        assertThat(stats).hasSize(1);
        assertThat(stats.get(0).getDeptName()).isEqualTo("Sales");
        assertThat(stats.get(0).getEmployeeCount()).isEqualTo(1);
    }
}
