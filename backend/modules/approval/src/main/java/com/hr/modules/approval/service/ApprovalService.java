package com.hr.modules.approval.service;

import com.hr.modules.approval.api.ApprovalModuleApi;
import com.hr.modules.approval.api.dto.ApprovalRequestCommand;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprovalService implements ApprovalModuleApi {

    private final ApprovalRequestRepository approvalRepository;

    @Override
    public Long createApproval(ApprovalRequestCommand command) {
        ApprovalRequest request = new ApprovalRequest();
        // Since ApprovalRequest might not have Builder or setters matching Command exactly,
        // we map it manually or usage a mapper.
        // Assuming ApprovalRequest has public setters or a proper constructor.
        // Based on plan and typical entity structure:
        
        request.setCompanyId(command.getCompanyId());
        request.setRequesterUserId(command.getRequesterId());
        request.setResourceType(command.getResourceType());
        request.setResourceId(command.getResourceId());
        request.setTitle(command.getTitle());
        request.setStatus("PENDING"); // Default
        
        // Step logic is skipped for MVP (Simple one-step or auto-approve logic could go here)
        // For now, just save the request header.
        
        ApprovalRequest saved = approvalRepository.save(request);
        return saved.getId();
    }
}
