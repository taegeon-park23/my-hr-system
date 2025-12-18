package com.hr.modules.tenant.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.tenant.domain.Tenant;
import com.hr.modules.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;
    private final com.hr.modules.user.api.UserModuleApi userModuleApi;
    private final com.hr.common.security.jwt.JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ApiResponse<Long> createTenant(@RequestBody CreateTenantRequest request) {
        Long tenantId = tenantService.createTenant(request.getName(), request.getDomain(), request.getPlanType());
        return ApiResponse.success(tenantId);
    }

    @PostMapping("/{id}/impersonate")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('SUPER_ADMIN')")
    public ApiResponse<String> impersonate(
            @PathVariable Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.hr.common.security.UserPrincipal adminUser
    ) {
        // 1. Find an admin user of the target tenant
        java.util.List<com.hr.modules.user.api.UserInfoDto> users = userModuleApi.getUsersByCompanyId(String.valueOf(id));
        
        com.hr.modules.user.api.UserInfoDto targetUser = users.stream()
                .filter(u -> "TENANT_ADMIN".equals(u.getRole()) || "ADMIN".equals(u.getRole()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No admin user found for tenant: " + id));

        // 2. Create impersonation token
        String token = jwtTokenProvider.createToken(
                targetUser.getUserId(),
                targetUser.getEmail(),
                targetUser.getRole(),
                String.valueOf(id),
                true // isImpersonated = true
        );

        return ApiResponse.success(token);
    }

    @GetMapping
    public ApiResponse<List<Tenant>> getAllTenants() {
        return ApiResponse.success(tenantService.getAllTenants());
    }

    @GetMapping("/{id}")
    public ApiResponse<Tenant> getTenant(@PathVariable Long id) {
        return ApiResponse.success(tenantService.getTenant(id));
    }

    @Data
    public static class CreateTenantRequest {
        private String name;
        private String domain;
        private String planType;
    }
}
