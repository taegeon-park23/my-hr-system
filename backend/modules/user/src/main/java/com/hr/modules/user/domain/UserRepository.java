package com.hr.modules.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByCompanyIdAndEmployeeNumber(Long companyId, String employeeNumber);
    List<User> findByDeptId(Long deptId);
}
