package com.hr.modules.org.api;

import com.hr.modules.org.domain.Department;
import com.hr.modules.org.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrgModuleApiImpl implements OrgModuleApi {

    private final DepartmentService departmentService;

    @Override
    public List<Long> getSubDeptIds(Long deptId) {
        return departmentService.getSubDeptIds(deptId);
    }

    @Override
    public Long getDeptLeaderId(Long deptId) {
        Department dept = departmentService.getDepartment(deptId);
        return dept.getLeaderUserId();
    }
}
