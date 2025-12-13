package com.hr.modules.approval.api;

import com.hr.modules.approval.api.dto.ApprovalRequestCommand;

public interface ApprovalModuleApi {
    Long createApproval(ApprovalRequestCommand command);
    // Future: cancelApproval, getStatus, etc.
}
