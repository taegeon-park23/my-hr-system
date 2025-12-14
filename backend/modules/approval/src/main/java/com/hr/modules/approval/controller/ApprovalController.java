package com.hr.modules.approval.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/approval")
public class ApprovalController {

    private final ApprovalRequestRepository approvalRepository;

    public ApprovalController(ApprovalRequestRepository approvalRepository) {
        this.approvalRepository = approvalRepository;
    }

    @GetMapping("/inbox")
    public ApiResponse<List<ApprovalRequest>> getMyRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        Long companyId = user.getCompanyId();
        Long requesterId = user.getId();
        return ApiResponse.success(approvalRepository.findByCompanyIdAndRequesterUserId(companyId, requesterId));
    }

    @GetMapping("/pending")
    public ApiResponse<List<ApprovalRequest>> getPendingRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        Long companyId = user.getCompanyId();
        Long userId = user.getId();
        return ApiResponse.success(approvalRepository.findPendingRequests(companyId, userId));
    }
    
    @PostMapping("/request")
    public ApiResponse<ApprovalRequest> createRequest(@RequestBody ApprovalRequest request) {
        // Basic implementation
        return ApiResponse.success(approvalRepository.save(request));
    }
}

