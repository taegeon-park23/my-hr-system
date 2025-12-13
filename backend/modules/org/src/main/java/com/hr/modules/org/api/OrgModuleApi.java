package com.hr.modules.org.api;

import java.util.List;

public interface OrgModuleApi {
    List<Long> getSubDeptIds(Long deptId);
}
