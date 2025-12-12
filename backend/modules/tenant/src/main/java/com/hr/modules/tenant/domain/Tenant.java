package com.hr.modules.tenant.domain;

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
@Table(name = "companies")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100, unique = true)
    private String domain;

    @Column(name = "business_number", length = 20)
    private String businessNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TenantStatus status; // ACTIVE, INACTIVE, SUSPENDED

    @Column(name = "plan_type", length = 20)
    private String planType; // BASIC, PRO, ENTERPRISE

    @Column(name = "expired_at")
    private LocalDate expiredAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Tenant(String name, String domain, String planType) {
        this.name = name;
        this.domain = domain;
        this.planType = planType;
        this.status = TenantStatus.ACTIVE;
    }

    public enum TenantStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
