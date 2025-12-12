package com.hr.modules.approval.service;

import com.hr.modules.approval.domain.*;
import com.hr.modules.org.api.OrgModuleApi;
import com.hr.modules.user.api.UserModuleApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final UserModuleApi userModuleApi;
    private final OrgModuleApi orgModuleApi;

    @Transactional
    public Long createRequest(Long companyId, Long requesterId, String resourceType, Long resourceId, String title) {
        // 1. Create Base Request
        ApprovalRequest request = new ApprovalRequest(companyId, resourceType, resourceId, requesterId, title);

        // 2. Generate Approval Line (Simple Strategy: Team Leader)
        // In real world, we would use a Strategy Pattern factory based on resourceType/Policy
        // MVP: Just add Team Leader as Step 1
        
        com.hr.modules.user.api.UserInfoDto userInfo = userModuleApi.getUserInfo(requesterId);
        Long deptId = userInfo.getDeptId();
        
        if (deptId != null) {
            Long leaderId = orgModuleApi.getDeptLeaderId(deptId);
            if (leaderId != null && !leaderId.equals(requesterId)) { // Self-approval prevention
                ApprovalStep step1 = new ApprovalStep(1, "Team Leader Approval");
                step1.addAssignee(new ApprovalAssignee(leaderId));
                request.addStep(step1);
            }
        }
        
        // If no leader found or self-approval needed, maybe add Super Admin or auto-approve?
        // For MVP, if empty steps, maybe auto approve?
        // Let's assume at least one step must exist or it stays pending.

        approvalRepository.save(request);
        return request.getId();
    }
    
    @Transactional
    public void approve(Long requestId, Long userId, String comment) {
        ApprovalRequest request = approvalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        
        // Find current step
        ApprovalStep currentStep = request.getSteps().stream()
                .filter(s -> s.getStepOrder().equals(request.getCurrentStepOrder()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Current step not found"));
                
        // Find assignee
        ApprovalAssignee assignee = currentStep.getAssignees().stream()
                .filter(a -> a.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Not an assignee"));
        
        assignee.approve(comment);
        
        // Check if step is completed (Consensus logic: ALL must approve? OR ANY?)
        // MVP: ANY approval completes the step if multiple? Or ALL?
        // Let's say ALL for now.
        boolean allApproved = currentStep.getAssignees().stream()
                .allMatch(a -> a.getStatus() == ApprovalAssignee.AssigneeStatus.APPROVED);
        
        if (allApproved) {
            currentStep.complete();
            // Move to next step or finish
            // Check next step
            // ... Logic to increment currentStepOrder ...
            // If last step, mark Request as APPROVED
            request.approve();
            // TODO: Publish ApprovalCompletedEvent
        }
    }
}
