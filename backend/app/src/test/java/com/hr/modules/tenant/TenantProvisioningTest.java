package com.hr.modules.tenant;

import com.hr.modules.tenant.service.TenantService;
import com.hr.modules.user.repository.UserRepository;
import com.hr.modules.org.repository.DepartmentRepository;
import com.hr.modules.user.domain.User;
import com.hr.modules.org.domain.Department;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = com.hr.app.HrSystemApplication.class)
@Transactional
public class TenantProvisioningTest {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        // Fix for potential ENUM issues in other tables if needed, 
        // but specifically for approval_steps which was failing before.
        jdbcTemplate.execute("ALTER TABLE approval_steps MODIFY COLUMN status VARCHAR(20)");
    }

    @Test
    void testTenantCreationAndProvisioning() {
        // Given
        String domain = "newcorp.com";
        String name = "New Corp";

        // When
        Long tenantId = tenantService.createTenant(name, domain, "PLATINUM");

        // Then: 1. Root Department should exist
        List<Department> depts = departmentRepository.findAll();
        boolean rootDeptExists = depts.stream()
                .anyMatch(d -> d.getCompanyId().equals(tenantId) && d.getName().equals(name) && d.getParentId() == null);
        assertThat(rootDeptExists).isTrue();

        // Then: 2. Initial Admin User should exist
        List<User> users = userRepository.findByCompanyId(tenantId);
        assertThat(users).hasSize(1);
        User admin = users.get(0);
        assertThat(admin.getEmail()).isEqualTo("admin@" + domain);
        assertThat(admin.getRole()).isEqualTo("TENANT_ADMIN");
    }
}
