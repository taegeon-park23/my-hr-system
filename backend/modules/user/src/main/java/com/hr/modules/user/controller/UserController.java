package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final com.hr.modules.user.service.UserService userService;

    @GetMapping("/me")
    public ApiResponse<com.hr.modules.user.dto.UserResponse> getMyProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(userService.getUser(user.getId()));
    }

    @GetMapping("/team-count")
    public ApiResponse<Long> getTeamCount(@RequestParam Long userId) {
        return ApiResponse.success(userService.getTeamCount(userId));
    }

    @GetMapping
    public ApiResponse<java.util.List<com.hr.modules.user.dto.UserResponse>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long deptId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(userService.searchUsers(Long.parseLong(user.getCompanyId()), query, deptId));
    }

    @GetMapping("/{id}")
    public ApiResponse<com.hr.modules.user.dto.UserResponse> getUser(@PathVariable Long id) {
        return ApiResponse.success(userService.getUser(id));
    }

    @PostMapping
    public ApiResponse<Long> createUser(
            @RequestBody com.hr.modules.user.dto.UserSaveRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal user
    ) {
        return ApiResponse.success(userService.createUser(Long.parseLong(user.getCompanyId()), request));
    }

    @PutMapping("/{id}")
    public ApiResponse<String> updateUser(
            @PathVariable Long id,
            @RequestBody com.hr.modules.user.dto.UserSaveRequest request
    ) {
        userService.updateUser(id, request);
        return ApiResponse.success("User updated successfully");
    }
}
