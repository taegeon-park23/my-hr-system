package com.hr.modules.approval.repository;

import com.hr.modules.approval.domain.ApprovalRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRuleRepository extends JpaRepository<ApprovalRule, Long> {
    List<ApprovalRule> findAllByCompanyIdAndRequestTypeOrderByPriorityAsc(Long companyId, String requestType);
}
