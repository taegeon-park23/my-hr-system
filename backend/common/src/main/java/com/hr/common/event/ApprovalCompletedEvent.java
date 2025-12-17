package com.hr.common.event;

import lombok.Getter;

@Getter
public class ApprovalCompletedEvent extends DomainEvent {
    private final Long companyId;
    private final Long approvalId;
    private final Long requesterId;
    private final String resourceType;

    public ApprovalCompletedEvent(Long companyId, Long approvalId, Long requesterId, String resourceType) {
        super();
        this.companyId = companyId;
        this.approvalId = approvalId;
        this.requesterId = requesterId;
        this.resourceType = resourceType;
    }
}
