package com.hr.common.event;

import lombok.Getter;

@Getter
public class ApprovalRequestedEvent extends DomainEvent {
    private final Long companyId;
    private final Long approvalId;
    private final Long requesterId;
    private final String title;
    private final String resourceType;

    public ApprovalRequestedEvent(Long companyId, Long approvalId, Long requesterId, String title, String resourceType) {
        super();
        this.companyId = companyId;
        this.approvalId = approvalId;
        this.requesterId = requesterId;
        this.title = title;
        this.resourceType = resourceType;
    }
}
