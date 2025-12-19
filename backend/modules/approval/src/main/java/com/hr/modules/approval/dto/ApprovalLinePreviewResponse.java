package com.hr.modules.approval.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class ApprovalLinePreviewResponse {
    private List<ApproverInfo> steps;

    @Getter
    @Builder
    public static class ApproverInfo {
        private int stepOrder;
        private Long approverId;
        private String approverName;
    }
}
