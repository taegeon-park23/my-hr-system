package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.user.domain.User;
import com.hr.modules.user.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<Long> createUser(@RequestBody CreateUserRequest request) {
        Long userId = userService.createUser(
                request.getCompanyId(),
                request.getEmail(),
                request.getPasswordHash(),
                request.getName(),
                request.getEmployeeNumber(),
                User.UserRole.valueOf(request.getRole()),
                request.getHireDate()
        );
        return ApiResponse.success(userId);
    }
    
    @GetMapping("/{id}")
    public ApiResponse<User> getUser(@PathVariable Long id) {
        return ApiResponse.success(userService.getUser(id));
    }

    @Data
    public static class CreateUserRequest {
        private Long companyId;
        private String email;
        private String passwordHash;
        private String name;
        private String employeeNumber;
        private String role;
        private LocalDate hireDate;
    }
}
