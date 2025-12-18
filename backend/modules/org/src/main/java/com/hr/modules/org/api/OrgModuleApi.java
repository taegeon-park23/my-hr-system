package com.hr.modules.org.api;

import java.util.List;

public interface OrgModuleApi {
    List<Long> getSubDeptIds(Long deptId);
    Long createRootDepartment(Long companyId, String name);
}
