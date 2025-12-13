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

    @GetMapping("/inbox/{requesterId}")
    public ApiResponse<List<ApprovalRequest>> getMyRequests(@PathVariable Long requesterId) {
        // In real app, requesterId comes from SecurityContext
        Long companyId = 1L; // Mock
        return ApiResponse.success(approvalRepository.findByCompanyIdAndRequesterId(companyId, requesterId));
    }
    
    @PostMapping("/request")
    public ApiResponse<ApprovalRequest> createRequest(@RequestBody ApprovalRequest request) {
        // Basic implementation
        return ApiResponse.success(approvalRepository.save(request));
    }
}

