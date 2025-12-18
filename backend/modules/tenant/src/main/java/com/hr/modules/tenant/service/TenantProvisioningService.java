package com.hr.modules.tenant.service;

import com.hr.common.event.TenantCreatedEvent;
import com.hr.modules.org.api.OrgModuleApi;
import com.hr.modules.user.api.UserModuleApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TenantProvisioningService {

    private final UserModuleApi userModuleApi;
    private final OrgModuleApi orgModuleApi;

    @EventListener
    @Transactional
    public void handleTenantCreated(TenantCreatedEvent event) {
        log.info("Provisioning tenant: {} (ID: {})", event.getTenantName(), event.getTenantId());

        try {
            // 1. Create Root Department
            Long rootDeptId = orgModuleApi.createRootDepartment(event.getTenantId(), event.getTenantName());
            log.info("Created root department: {} for tenant: {}", rootDeptId, event.getTenantId());

            // 2. Create Initial Admin User
            // Using a default password for MVP. In production, this should be a random token sent via email.
            Long adminId = userModuleApi.createInitialAdmin(
                    event.getTenantId(),
                    event.getAdminEmail(),
                    "Admin",
                    "admin123"
            );
            log.info("Created initial admin: {} for tenant: {}", adminId, event.getTenantId());
            
            // 3. Link Admin to Root Dept (Optional if createInitialAdmin does it, 
            // but let's assume we might need to update it here if API is split)
            // For now, let's keep it simple.

        } catch (Exception e) {
            log.error("Failed to provision tenant: " + event.getTenantId(), e);
            // In a real system, we might want to mark the tenant as "FAILED_PROVISIONING"
            throw e;
        }
    }
}
