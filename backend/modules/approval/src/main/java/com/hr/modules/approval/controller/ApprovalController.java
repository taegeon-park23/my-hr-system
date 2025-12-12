package com.hr.modules.approval.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.approval.service.ApprovalService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approval/requests")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    // Usually created via internal module API (e.g. Vacation Service calls Approval Service)
    // But for testing or specialized manual ad-hoc requests, maybe expose an API?
    // Let's expose an approve endpoint for Assignees to click "Approve".
    
    @PostMapping("/{id}/approve")
    public ApiResponse<Void> approve(@PathVariable Long id, @RequestBody ApproveRequest request) {
        // In real app, userId comes from SecurityContext (JWT)
        approvalService.approve(id, request.getUserId(), request.getComment());
        return ApiResponse.success(null);
    }

    @Data
    public static class ApproveRequest {
        private Long userId; // For MVP testing
        private String comment;
    }
}
