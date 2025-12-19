package com.hr.modules.user.api;

import lombok.Builder;
import lombok.Data;

public interface UserModuleApi {
    UserInfoDto getUserInfo(Long userId);
    java.util.List<UserInfoDto> getUsersByCompanyId(String companyId);
    Long getManagerIdOfUser(Long userId);
    java.util.List<UserInfoDto> getUsersByDeptId(Long deptId);
    Long getDeptHeadId(Long deptId);
    Long createInitialAdmin(Long companyId, String email, String name, String password);

}
