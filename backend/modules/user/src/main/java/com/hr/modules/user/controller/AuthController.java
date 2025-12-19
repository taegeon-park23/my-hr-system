package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.user.dto.LoginResponse;
import com.hr.modules.user.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final com.hr.modules.user.service.UserService userService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.success(userService.login(request.getEmail(), request.getPassword()));
    }
}
