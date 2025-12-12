package com.hr.modules.user.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfoDto {
    private Long userId;
    private Long companyId;
    private Long deptId;
    private String name;
    private String role;
}
