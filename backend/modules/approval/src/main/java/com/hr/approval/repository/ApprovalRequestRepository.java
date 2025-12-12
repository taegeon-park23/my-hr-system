package com.hr.approval.repository;

import com.hr.approval.domain.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByCompanyIdAndRequesterId(Long companyId, Long requesterId);
}
