package com.hr.modules.approval.api.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApprovalCompletedEvent {
    private Long requestId;
    private String resourceType;
    private Long resourceId;
    private boolean approved; // true=APPROVED, false=REJECTED
}
