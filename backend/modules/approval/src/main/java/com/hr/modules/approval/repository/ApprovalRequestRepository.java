package com.hr.modules.approval.repository;

import com.hr.modules.approval.domain.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByCompanyIdAndRequesterUserId(Long companyId, Long requesterUserId);
    List<ApprovalRequest> findByCompanyId(Long companyId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM ApprovalRequest r " +
           "JOIN com.hr.modules.approval.domain.ApprovalStep s ON s.request = r " +
           "WHERE s.approverId = :userId AND s.status = 'PENDING' " +
           "AND r.companyId = :companyId")
    List<ApprovalRequest> findPendingRequests(@org.springframework.data.repository.query.Param("companyId") Long companyId, 
                                              @org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM ApprovalRequest r " +
           "JOIN com.hr.modules.approval.domain.ApprovalStep s ON s.request = r " +
           "WHERE s.approverId = :userId AND s.status != 'PENDING' " +
           "AND r.companyId = :companyId")
    List<ApprovalRequest> findArchiveRequests(@org.springframework.data.repository.query.Param("companyId") Long companyId, 
                                              @org.springframework.data.repository.query.Param("userId") Long userId);
}


