package com.hr.modules.recruitment.service;

import com.hr.modules.recruitment.domain.JobPosting;
import com.hr.modules.recruitment.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitmentService {

    private final JobPostingRepository jobPostingRepository;

    @Transactional
    public JobPosting createJobPosting(Long companyId, String title, String description) {
        JobPosting posting = JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .status(JobPosting.PostingStatus.OPEN)
                .build();
        return jobPostingRepository.save(posting);
    }

    public List<JobPosting> getJobPostings(Long companyId) {
        return jobPostingRepository.findByCompanyId(companyId);
    }
}
