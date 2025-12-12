package com.hr.modules.user.api;

import com.hr.modules.user.domain.User;
import com.hr.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserModuleApiImpl implements UserModuleApi {

    private final UserService userService;

    @Override
    public UserInfoDto getUserInfo(Long userId) {
        User user = userService.getUser(userId);
        return UserInfoDto.builder()
                .userId(user.getId())
                .companyId(user.getCompanyId())
                .deptId(user.getDeptId())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public List<Long> getDeptMembers(Long deptId) {
        return userService.getDeptMembers(deptId).stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @Override
    public boolean validateUserInTenant(Long userId, Long companyId) {
        User user = userService.getUser(userId);
        return user.getCompanyId().equals(companyId);
    }
}
