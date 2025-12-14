package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.user.domain.User;
import com.hr.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/team-count")
    public ApiResponse<Long> getTeamCount(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getDeptId() == null) {
            return ApiResponse.success(0L);
        }

        long count = userRepository.countByDeptId(user.getDeptId());
        return ApiResponse.success(count);
    }
}
