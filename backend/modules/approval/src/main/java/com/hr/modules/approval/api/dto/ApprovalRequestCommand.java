package com.hr.modules.approval.api.dto;

import java.util.List;

public class ApprovalRequestCommand {
    private Long companyId;
    private Long requesterId;
    private String resourceType; // e.g., "VACATION"
    private Long resourceId;     // e.g., VacationRequest ID
    private String title;
    private String description;
    private List<Long> approverIds;

    public ApprovalRequestCommand(Long companyId, Long requesterId, String resourceType, Long resourceId, String title, String description, List<Long> approverIds) {
        this.companyId = companyId;
        this.requesterId = requesterId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.title = title;
        this.description = description;
        this.approverIds = approverIds;
    }

    // Manual Getters
    public Long getCompanyId() { return companyId; }
    public Long getRequesterId() { return requesterId; }
    public String getResourceType() { return resourceType; }
    public Long getResourceId() { return resourceId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public List<Long> getApproverIds() { return approverIds; }

    // Simple Builder if needed, but let's just use constructor or a simple static method
    public static ApprovalRequestCommandBuilder builder() {
        return new ApprovalRequestCommandBuilder();
    }

    public static class ApprovalRequestCommandBuilder {
        private Long companyId;
        private Long requesterId;
        private String resourceType;
        private Long resourceId;
        private String title;
        private String description;
        private List<Long> approverIds;

        public ApprovalRequestCommandBuilder companyId(Long companyId) { this.companyId = companyId; return this; }
        public ApprovalRequestCommandBuilder requesterId(Long requesterId) { this.requesterId = requesterId; return this; }
        public ApprovalRequestCommandBuilder resourceType(String resourceType) { this.resourceType = resourceType; return this; }
        public ApprovalRequestCommandBuilder resourceId(Long resourceId) { this.resourceId = resourceId; return this; }
        public ApprovalRequestCommandBuilder title(String title) { this.title = title; return this; }
        public ApprovalRequestCommandBuilder description(String description) { this.description = description; return this; }
        public ApprovalRequestCommandBuilder approverIds(List<Long> approverIds) { this.approverIds = approverIds; return this; }

        public ApprovalRequestCommand build() {
            return new ApprovalRequestCommand(companyId, requesterId, resourceType, resourceId, title, description, approverIds);
        }
    }
}
