package com.hr.modules.user.repository;

import com.hr.modules.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    java.util.List<User> findByCompanyId(Long companyId);
    long countByDeptId(Long deptId);
}

