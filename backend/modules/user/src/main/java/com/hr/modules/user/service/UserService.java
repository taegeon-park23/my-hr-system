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
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.hr.common.security.jwt.JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public Long createInitialAdmin(Long companyId, String email, String name, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        User admin = new User(companyId, email, encodedPassword, name, "TENANT_ADMIN");
        return userRepository.save(admin).getId();
    }

    public com.hr.modules.user.dto.LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtTokenProvider.createToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                String.valueOf(user.getCompanyId()),
                false
        );

        return com.hr.modules.user.dto.LoginResponse.builder()
                .accessToken(token)
                .user(com.hr.modules.user.dto.UserDto.from(user))
                .build();
    }

    public long getTeamCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getDeptId() == null) {
            return 0L;
        }

        return userRepository.countByDeptId(user.getDeptId());
    }

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
                .role(user.getRole())
                .build();
    }

    @Override
    public java.util.List<UserInfoDto> getUsersByCompanyId(String companyId) {
        Long compId = Long.parseLong(companyId);
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

    @Override
    public java.util.List<UserInfoDto> getUsersByDeptId(Long deptId) {
        if (deptId == null) return java.util.Collections.emptyList();
        return userRepository.findByDeptId(deptId).stream()
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
}

