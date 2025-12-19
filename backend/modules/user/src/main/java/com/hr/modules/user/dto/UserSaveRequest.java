package com.hr.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSaveRequest {
    private String email;
    private String name;
    private String password;
    private Long deptId;
    private String role;
}
