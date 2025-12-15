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

    @Override
    public java.util.List<UserInfoDto> getUsersByCompanyId(String companyId) {
        Long compId = Long.parseLong(companyId); // Type conversion
        return userRepository.findByCompanyId(compId).stream()
                .map(user -> UserInfoDto.builder()
                        .userId(user.getId())
                        .companyId(user.getCompanyId())
                        .deptId(user.getDeptId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Long getManagerIdOfUser(Long userId) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        if (requester.getDeptId() == null) {
            throw new IllegalStateException("User does not belong to any department");
        }

        java.util.List<User> managers = userRepository.findManagersByDeptId(requester.getDeptId());
        
        return managers.stream()
                .filter(u -> !u.getId().equals(userId))
                .map(User::getId)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No manager found for department: " + requester.getDeptId()));
    }
}
