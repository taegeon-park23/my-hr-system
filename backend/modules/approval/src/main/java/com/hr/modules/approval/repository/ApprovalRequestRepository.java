package com.hr.modules.approval.repository;

import com.hr.modules.approval.domain.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByCompanyIdAndRequesterUserId(Long companyId, Long requesterUserId);

}

