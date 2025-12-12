package com.hr.modules.approval.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ApprovalRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByRequesterUserId(Long requesterUserId);
    // Find requests where a step is pending and the user is an assignee?
    // Complex query, maybe QueryDSL later.
    // For now simple repository methods.
}
