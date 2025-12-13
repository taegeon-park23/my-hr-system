package com.hr.modules.user.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(name = "dept_id")
    private Long deptId;

    @Column(nullable = false)
    private String role; // "USER", "ADMIN", etc.

    public User(Long companyId, String email, String passwordHash, String name, String role) {
        this.companyId = companyId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }
}

