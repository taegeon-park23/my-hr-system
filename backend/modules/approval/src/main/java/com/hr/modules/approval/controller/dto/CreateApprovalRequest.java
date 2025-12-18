package com.hr.modules.approval.controller.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CreateApprovalRequest {
    private String title;
    private String resourceType;
    private Long resourceId;
    private List<Long> approverIds;
}
