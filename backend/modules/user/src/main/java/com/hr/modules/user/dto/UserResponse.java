package com.hr.modules.user.dto;

import com.hr.modules.user.domain.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private Long deptId;
    private String role;
    private Long companyId;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .deptId(user.getDeptId())
                .role(user.getRole())
                .companyId(user.getCompanyId())
                .build();
    }
}
