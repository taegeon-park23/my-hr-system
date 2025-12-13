package com.hr.modules.org.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "departments")
@Getter
@NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(nullable = false)
    private String name;

    private String path; // Materialized Path or similar for recursion optimization

    private int depth;

    public Department(Long companyId, Long parentId, String name, int depth) {
        this.companyId = companyId;
        this.parentId = parentId;
        this.name = name;
        this.depth = depth;
    }
}

