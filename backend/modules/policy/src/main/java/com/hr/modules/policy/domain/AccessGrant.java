package com.hr.modules.policy.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "access_grants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class AccessGrant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grantee_user_id", nullable = false)
    private Long granteeUserId;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType; // e.g., PAYROLL, EVALUATION

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @Column(name = "permission_type", nullable = false, length = 50)
    private String permissionType; // READ, WRITE

    @Column(name = "expiration_time", nullable = false)
    private LocalDateTime expirationTime;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public AccessGrant(Long granteeUserId, String resourceType, Long resourceId, String permissionType, LocalDateTime expirationTime) {
        this.granteeUserId = granteeUserId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.permissionType = permissionType;
        this.expirationTime = expirationTime;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expirationTime);
    }
}
