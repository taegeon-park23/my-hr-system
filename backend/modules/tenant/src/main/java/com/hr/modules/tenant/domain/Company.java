package com.hr.modules.tenant.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "companies")
@Getter
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String domain;

    @Column(name = "is_active")
    private boolean active = true;

    public Company(String name, String domain) {
        this.name = name;
        this.domain = domain;
    }
}

