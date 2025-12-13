package com.hr.modules.org.repository;

import com.hr.modules.org.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByCompanyId(Long companyId);
    List<Department> findByParentId(Long parentId);
}

