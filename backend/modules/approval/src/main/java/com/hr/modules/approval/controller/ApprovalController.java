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
    private final com.hr.modules.approval.service.ApprovalService approvalService;

    public ApprovalController(ApprovalRequestRepository approvalRepository, 
                              com.hr.modules.approval.service.ApprovalService approvalService) {
        this.approvalRepository = approvalRepository;
        this.approvalService = approvalService;
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
    public ApiResponse<Long> createRequest(
            @RequestBody ApprovalRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        com.hr.modules.approval.api.dto.ApprovalRequestCommand command = com.hr.modules.approval.api.dto.ApprovalRequestCommand.builder()
                .companyId(user.getCompanyId())
                .requesterId(user.getId())
                // Use defaults if null
                .resourceType(request.getResourceType() != null ? request.getResourceType() : "GENERAL")
                .resourceId(request.getResourceId() != null ? request.getResourceId() : 0L)
                .title(request.getTitle())
                .description(null) // Not in basic entity
                .build();

        return ApiResponse.success(approvalService.createApproval(command));
    }

    @GetMapping("/{id}")
    public ApiResponse<ApprovalRequest> getApprovalDetail(@PathVariable Long id) {
        return ApiResponse.success(approvalService.getApprovalRequest(id));
    }
}

