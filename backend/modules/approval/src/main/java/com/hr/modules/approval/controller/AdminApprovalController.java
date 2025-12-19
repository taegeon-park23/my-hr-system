package com.hr.modules.approval.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.UserPrincipal;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/approvals")
@RequiredArgsConstructor
public class AdminApprovalController {

    private final ApprovalService approvalService;

    @GetMapping
    public ApiResponse<List<ApprovalRequest>> getAllApprovals(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        Long companyId = Long.parseLong(user.getCompanyId());
        return ApiResponse.success(approvalService.getAdminApprovals(companyId));
    }

    @PostMapping("/{id}/force-decision")
    public ApiResponse<Void> forceDecision(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String comment
    ) {
        approvalService.forceApprovalDecision(id, status, comment);
        return ApiResponse.success(null);
    }
}
