package com.hr.modules.org.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "departments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "leader_user_id")
    private Long leaderUserId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "path_string", length = 500)
    private String pathString; // Ancestor Path e.g., 1>5>10

    @Column(nullable = false)
    private Integer depth;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Department(Long companyId, Long parentId, String name, Integer depth) {
        this.companyId = companyId;
        this.parentId = parentId;
        this.name = name;
        this.depth = depth;
    }
    
    public void setPathString(String pathString) {
        this.pathString = pathString;
    }

    public void setLeader(Long userId) {
        this.leaderUserId = userId;
    }
}
