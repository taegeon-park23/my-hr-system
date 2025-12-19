package com.hr.modules.user.repository;

import com.hr.modules.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    java.util.List<User> findByCompanyId(Long companyId);
    java.util.List<User> findByDeptId(Long deptId);
    long countByDeptId(Long deptId);

    
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.deptId = :deptId AND u.role IN ('TENANT_ADMIN', 'MANAGER')")
    java.util.List<User> findManagersByDeptId(@org.springframework.data.repository.query.Param("deptId") Long deptId);
}

