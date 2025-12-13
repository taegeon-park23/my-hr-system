package com.hr.modules.user.service;

import com.hr.modules.user.api.UserModuleApi;
import com.hr.modules.user.api.UserInfoDto;

import com.hr.modules.user.domain.User;
import com.hr.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserModuleApi {

    private final UserRepository userRepository;

    @Override
    public UserInfoDto getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return UserInfoDto.builder()
                .userId(user.getId())
                .companyId(user.getCompanyId())
                .deptId(user.getDeptId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().toString()) // Assuming Role is Enum or String
                .build();
    }
}
