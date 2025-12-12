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

    @PostMapping
    public ApiResponse<Long> createTenant(@RequestBody CreateTenantRequest request) {
        Long tenantId = tenantService.createTenant(request.getName(), request.getDomain(), request.getPlanType());
        return ApiResponse.success(tenantId);
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
