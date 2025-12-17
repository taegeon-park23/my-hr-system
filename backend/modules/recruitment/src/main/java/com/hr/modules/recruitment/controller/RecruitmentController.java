package com.hr.modules.recruitment.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.SecurityUtils;
import com.hr.modules.recruitment.api.dto.JobPostingCreateRequest;
import com.hr.modules.recruitment.domain.JobPosting;
import com.hr.modules.recruitment.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @PostMapping("/jobs")
    public ApiResponse<JobPosting> createJobPosting(@RequestBody JobPostingCreateRequest request) {
        Long companyId = Long.parseLong(SecurityUtils.getCurrentCompanyId());
        JobPosting posting = recruitmentService.createJobPosting(companyId, request.getTitle(), request.getDescription());
        return ApiResponse.success(posting);
    }

    @GetMapping("/jobs")
    public ApiResponse<List<JobPosting>> getJobPostings() {
        Long companyId = Long.parseLong(SecurityUtils.getCurrentCompanyId());
        List<JobPosting> postings = recruitmentService.getJobPostings(companyId);
        return ApiResponse.success(postings);
    }
}
