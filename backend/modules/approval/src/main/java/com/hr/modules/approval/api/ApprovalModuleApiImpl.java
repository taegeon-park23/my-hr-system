package com.hr.modules.approval.api;

import com.hr.modules.approval.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApprovalModuleApiImpl implements ApprovalModuleApi {

    private final ApprovalService approvalService;

    @Override
    public Long createRequest(CreateApprovalRequestDto dto) {
        return approvalService.createRequest(
                dto.getCompanyId(),
                dto.getRequesterId(),
                dto.getResourceType(),
                dto.getResourceId(),
                dto.getTitle()
        );
    }
}
