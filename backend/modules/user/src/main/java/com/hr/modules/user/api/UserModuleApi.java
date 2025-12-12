package com.hr.modules.user.api;

import java.util.List;

public interface UserModuleApi {
    UserInfoDto getUserInfo(Long userId);
    List<Long> getDeptMembers(Long deptId);
    boolean validateUserInTenant(Long userId, Long companyId);
}
