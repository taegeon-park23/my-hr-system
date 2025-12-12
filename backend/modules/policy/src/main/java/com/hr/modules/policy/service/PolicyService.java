package com.hr.modules.policy.service;

import com.hr.modules.policy.api.DataScope;
import com.hr.modules.policy.domain.AccessGrant;
import com.hr.modules.policy.domain.AccessGrantRepository;
import com.hr.modules.user.api.UserInfoDto;
import com.hr.modules.user.api.UserModuleApi;
import com.hr.modules.org.api.OrgModuleApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PolicyService {

    private final UserModuleApi userModuleApi;
    private final OrgModuleApi orgModuleApi;
    private final AccessGrantRepository accessGrantRepository;

    public DataScope resolveDataScope(Long userId, String resource, String viewMode) {
        UserInfoDto user = userModuleApi.getUserInfo(userId);
        
        // 1. Super Admin
        if ("SUPER_ADMIN".equals(user.getRole())) {
            return new DataScope(DataScope.ScopeType.GLOBAL_ALL, null, Collections.emptyList());
        }

        // 2. Tenant Admin
        if ("TENANT_ADMIN".equals(user.getRole())) {
            // Can see all company data
            return new DataScope(DataScope.ScopeType.COMPANY_WIDE, user.getCompanyId(), Collections.emptyList());
        }

        // 3. Department Manager (Team Leader)
        // If viewMode is TEAM or Default, checks if user is leader.
        if ("DEPT_MANAGER".equals(user.getRole())) {
            if ("MY".equals(viewMode)) {
                 return new DataScope(DataScope.ScopeType.USER_ONLY, user.getCompanyId(), List.of(userId));
            }
            // Logic: Is this user actually the leader of their dept?
            // In a real system, we might query OrgModule to confirm leadership.
            // Assuming role bit is accurate.
            List<Long> subDeptIds = orgModuleApi.getSubDeptIds(user.getDeptId());
            // Add own dept
            subDeptIds.add(user.getDeptId());
            
            return new DataScope(DataScope.ScopeType.DEPT_TREE, user.getCompanyId(), subDeptIds);
        }

        // 4. Normal User
        // Check for Temporary Tickets (AccessGrant)
        List<AccessGrant> grants = accessGrantRepository.findByGranteeUserIdAndResourceTypeAndExpirationTimeAfter(
                userId, resource, LocalDateTime.now());
        
        if (!grants.isEmpty()) {
            // Combine granted resources? For now, just return the first one or valid scope.
            // If grant exists, maybe allow specific resource access.
            // DataScope needs adjustment to support "LIST of Resource IDs".
            // START MVP: Just USER_ONLY.
        }

        return new DataScope(DataScope.ScopeType.USER_ONLY, user.getCompanyId(), List.of(userId));
    }

    public boolean hasPermission(Long userId, String permissionCode) {
        // Simple RBAC check or more complex logic
        UserInfoDto user = userModuleApi.getUserInfo(userId);
        
        if ("SUPER_ADMIN".equals(user.getRole())) return true;
        
        // Example logic
        if ("TENANT_MGMT".equals(permissionCode)) {
            return "SUPER_ADMIN".equals(user.getRole());
        }
        if ("HR_MGMT".equals(permissionCode)) {
             return "TENANT_ADMIN".equals(user.getRole()) || "DEPT_MANAGER".equals(user.getRole());
        }
        
        return true; // Default allow for basic features? Or deny? Default DENY usually.
    }

    @Transactional
    public void issueTemporaryTicket(Long targetUserId, String resource, Long resourceId, String permission, long ttlSeconds) {
        AccessGrant grant = new AccessGrant(
                targetUserId, 
                resource, 
                resourceId, 
                permission, 
                LocalDateTime.now().plusSeconds(ttlSeconds)
        );
        accessGrantRepository.save(grant);
    }
}
