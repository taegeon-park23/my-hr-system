package com.hr.modules.approval.api.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ApprovalRequestCommand {
    private Long companyId;
    private Long requesterId;
    private String resourceType; // e.g., "VACATION"
    private Long resourceId;     // e.g., VacationRequest ID
    private String title;
    private String description;
}
