package com.hr.modules.org.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByParentId(Long parentId);
    List<Department> findByCompanyId(Long companyId);
}
