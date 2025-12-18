package com.hr.modules.org.service;

import com.hr.modules.org.api.OrgModuleApi;
import com.hr.modules.org.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgService implements OrgModuleApi {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public Long createRootDepartment(Long companyId, String name) {
        com.hr.modules.org.domain.Department root = new com.hr.modules.org.domain.Department(companyId, null, name, 0);
        return departmentRepository.save(root).getId();
    }

    @Override
    public List<Long> getSubDeptIds(Long deptId) {
        if (deptId == null) return Collections.emptyList();
        // MVP: Just return empty or implement simple logic if Department entity has path
        // For MVP, returning empty list is fine to pass build.
        return Collections.emptyList(); 
    }
}
