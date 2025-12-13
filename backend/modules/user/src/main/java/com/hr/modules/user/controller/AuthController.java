package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.common.security.jwt.JwtTokenProvider;
import com.hr.modules.user.domain.User;
import com.hr.modules.user.dto.LoginResponse;
import com.hr.modules.user.dto.LoginRequest;
import com.hr.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtTokenProvider.createToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getCompanyId()
        );

        return ApiResponse.success(LoginResponse.builder()
                .accessToken(token)
                .user(com.hr.modules.user.dto.UserDto.from(user))
                .build());
    }
}

