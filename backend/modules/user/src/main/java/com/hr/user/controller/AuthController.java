package com.hr.user.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.user.dto.LoginRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request) {
        // Mock Login Logic
        if ("admin@samsung.com".equals(request.getEmail())) {
             // In real app, verify passwordHash
            return ApiResponse.success("mock-jwt-token-USER-12345");
        }
        return ApiResponse.error("Invalid credentials");
    }
}
