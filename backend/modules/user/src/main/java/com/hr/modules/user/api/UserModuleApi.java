package com.hr.modules.user.api;

import lombok.Builder;
import lombok.Data;

public interface UserModuleApi {
    UserInfoDto getUserInfo(Long userId);
    java.util.List<UserInfoDto> getUsersByCompanyId(String companyId);
}
