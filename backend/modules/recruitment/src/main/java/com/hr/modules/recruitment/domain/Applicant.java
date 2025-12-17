package com.hr.modules.recruitment.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recruitment_applicants")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id", nullable = false)
    private JobPosting jobPosting;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicantStatus status;

    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
    }

    public enum ApplicantStatus {
        APPLIED, REVIEWING, INTERVIEW, OFFER, REJECTED
    }
}
