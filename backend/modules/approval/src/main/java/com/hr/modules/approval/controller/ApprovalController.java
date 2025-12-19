package com.hr.modules.approval.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/approval")
public class ApprovalController {

    private final com.hr.modules.approval.service.ApprovalService approvalService;

    public ApprovalController(com.hr.modules.approval.service.ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping("/inbox")
    public ApiResponse<List<ApprovalRequest>> getMyRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        Long companyId = Long.parseLong(user.getCompanyId());
        Long requesterId = user.getId();
        return ApiResponse.success(approvalService.getInbox(companyId, requesterId));
    }

    @GetMapping("/pending")
    public ApiResponse<List<ApprovalRequest>> getPendingRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        Long companyId = Long.parseLong(user.getCompanyId());
        Long userId = user.getId();
        return ApiResponse.success(approvalService.getPending(companyId, userId));
    }

    @GetMapping("/archive")
    public ApiResponse<List<ApprovalRequest>> getArchiveRequests(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        Long companyId = Long.parseLong(user.getCompanyId());
        Long userId = user.getId();
        return ApiResponse.success(approvalService.getArchive(companyId, userId));
    }

    @GetMapping("/line/preview")
    public ApiResponse<com.hr.modules.approval.controller.dto.ApprovalLinePreviewResponse> getLinePreview(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(approvalService.getLinePreview(user.getId()));
    }

    
    @PostMapping("/request")
    public ApiResponse<Long> createRequest(
            @RequestBody com.hr.modules.approval.controller.dto.CreateApprovalRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        com.hr.modules.approval.api.dto.ApprovalRequestCommand command = com.hr.modules.approval.api.dto.ApprovalRequestCommand.builder()
                .companyId(Long.parseLong(user.getCompanyId()))
                .requesterId(user.getId())
                .resourceType(request.getResourceType() != null ? request.getResourceType() : "GENERAL")
                .resourceId(request.getResourceId() != null ? request.getResourceId() : 0L)
                .title(request.getTitle())
                .approverIds(request.getApproverIds())
                .build();

        return ApiResponse.success(approvalService.createApproval(command));
    }

    @PostMapping("/steps/{stepId}/approve")
    public ApiResponse<Void> approveStep(
            @PathVariable Long stepId,
            @RequestBody(required = false) com.hr.modules.approval.controller.dto.ApproveStepRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        String comment = (request != null) ? request.getComment() : "";
        approvalService.approveStep(stepId, user.getId(), comment);
        return ApiResponse.success(null);
    }

    @PostMapping("/steps/{stepId}/reject")
    public ApiResponse<Void> rejectStep(
            @PathVariable Long stepId,
            @RequestBody(required = false) com.hr.modules.approval.controller.dto.ApproveStepRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        String comment = (request != null) ? request.getComment() : "";
        approvalService.rejectStep(stepId, user.getId(), comment);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}")
    public ApiResponse<ApprovalRequest> getApprovalDetail(@PathVariable Long id) {
        return ApiResponse.success(approvalService.getApprovalRequest(id));
    }
}

