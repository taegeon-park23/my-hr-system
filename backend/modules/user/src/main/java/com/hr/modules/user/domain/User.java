package com.hr.modules.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "dept_id")
    private Long deptId;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "employee_number", nullable = false, length = 20)
    private String employeeNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role; // SUPER_ADMIN, TENANT_ADMIN, DEPT_MANAGER, USER

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status; // ACTIVE, INACTIVE

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "resign_date")
    private LocalDate resignDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User(Long companyId, String email, String passwordHash, String name, String employeeNumber, UserRole role, LocalDate hireDate) {
        this.companyId = companyId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.employeeNumber = employeeNumber;
        this.role = role;
        this.hireDate = hireDate;
        this.status = UserStatus.ACTIVE;
    }

    public void updateDept(Long deptId) {
        this.deptId = deptId;
    }

    public enum UserRole {
        SUPER_ADMIN, TENANT_ADMIN, DEPT_MANAGER, USER
    }

    public enum UserStatus {
        ACTIVE, INACTIVE
    }
}
