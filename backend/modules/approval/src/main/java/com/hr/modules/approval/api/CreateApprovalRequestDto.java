package com.hr.modules.approval.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateApprovalRequestDto {
    private Long companyId;
    private Long requesterId;
    private String resourceType;
    private Long resourceId;
    private String title;
}
