package com.hr.modules.tenant.api;

public interface TenantModuleApi {
    boolean isValidTenant(Long companyId);
    // TenantConfigDto getTenantConfig(Long companyId); 
}
