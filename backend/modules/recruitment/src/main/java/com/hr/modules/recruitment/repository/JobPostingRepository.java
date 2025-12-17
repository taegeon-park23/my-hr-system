package com.hr.modules.recruitment.repository;

import com.hr.modules.recruitment.domain.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByCompanyId(Long companyId);
}
