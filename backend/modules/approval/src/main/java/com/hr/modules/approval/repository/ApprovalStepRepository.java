package com.hr.modules.approval.repository;

import com.hr.modules.approval.domain.ApprovalStep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalStepRepository extends JpaRepository<ApprovalStep, Long> {
}
