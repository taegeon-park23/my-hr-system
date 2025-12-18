package com.hr.modules.approval;

import com.hr.modules.approval.api.dto.ApprovalRequestCommand;
import com.hr.modules.approval.domain.ApprovalRequest;
import com.hr.modules.approval.domain.ApprovalStep;
import com.hr.modules.approval.repository.ApprovalRequestRepository;
import com.hr.modules.approval.repository.ApprovalStepRepository;
import com.hr.modules.approval.service.ApprovalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(classes = com.hr.app.HrSystemApplication.class)
@Transactional
public class ApprovalServiceTest {

    @Autowired
    private ApprovalService approvalService;

    @Autowired
    private ApprovalRequestRepository approvalRepository;

    @Autowired
    private ApprovalStepRepository approvalStepRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        // Force update status column to VARCHAR to avoid ENUM truncation during tests
        jdbcTemplate.execute("ALTER TABLE approval_steps MODIFY COLUMN status VARCHAR(20)");
    }

    @Test
    void testMultiStepApprovalFlow() {
        // Given
        Long companyId = 1L;
        Long requesterId = 10L;
        List<Long> approvers = List.of(101L, 102L, 103L);

        ApprovalRequestCommand command = ApprovalRequestCommand.builder()
                .companyId(companyId)
                .requesterId(requesterId)
                .title("Test Multi-step Approval")
                .resourceType("GENERAL")
                .resourceId(1L)
                .approverIds(approvers)
                .build();

        // 1. Create Approval
        Long requestId = approvalService.createApproval(command);

        ApprovalRequest request = approvalRepository.findById(requestId).orElseThrow();
        assertThat(request.getStatus()).isEqualTo("PENDING");
        assertThat(request.getSteps()).hasSize(3);
        assertThat(request.getCurrentStepOrder()).isEqualTo(1);
        
        ApprovalStep step1 = request.getSteps().get(0);
        ApprovalStep step2 = request.getSteps().get(1);
        ApprovalStep step3 = request.getSteps().get(2);

        assertThat(step1.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.PENDING);
        assertThat(step2.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.WAITING);
        assertThat(step3.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.WAITING);

        // 2. Approve Step 1
        approvalService.approveStep(step1.getId(), 101L, "Looks good");

        assertThat(step1.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.APPROVED);
        assertThat(request.getCurrentStepOrder()).isEqualTo(2);
        assertThat(step2.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.PENDING);
        assertThat(request.getStatus()).isEqualTo("PENDING");

        // 3. Try to approve Step 3 out of order (Should fail)
        assertThatThrownBy(() -> approvalService.approveStep(step3.getId(), 103L, "Cheat"))
                .isInstanceOf(IllegalStateException.class);

        // 4. Approve Step 2
        approvalService.approveStep(step2.getId(), 102L, "Verified");

        assertThat(step2.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.APPROVED);
        assertThat(request.getCurrentStepOrder()).isEqualTo(3);
        assertThat(step3.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.PENDING);
        assertThat(request.getStatus()).isEqualTo("PENDING");

        // 5. Final Approve Step 3
        approvalService.approveStep(step3.getId(), 103L, "Final OK");

        assertThat(step3.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.APPROVED);
        assertThat(request.getStatus()).isEqualTo("APPROVED");
    }

    @Test
    void testRejectionFlow() {
        // Given
        Long companyId = 1L;
        Long requesterId = 10L;
        List<Long> approvers = List.of(101L, 102L);

        ApprovalRequestCommand command = ApprovalRequestCommand.builder()
                .companyId(companyId)
                .requesterId(requesterId)
                .title("Test Rejection")
                .resourceType("GENERAL")
                .resourceId(2L)
                .approverIds(approvers)
                .build();

        Long requestId = approvalService.createApproval(command);
        ApprovalRequest request = approvalRepository.findById(requestId).orElseThrow();
        ApprovalStep step1 = request.getSteps().get(0);
        ApprovalStep step2 = request.getSteps().get(1);

        // When: Reject at Step 1
        approvalService.rejectStep(step1.getId(), 101L, "No way");

        // Then
        assertThat(step1.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.REJECTED);
        assertThat(request.getStatus()).isEqualTo("REJECTED");
        assertThat(step2.getStatus()).isEqualTo(ApprovalStep.ApprovalStatus.CANCELED);
    }
}
