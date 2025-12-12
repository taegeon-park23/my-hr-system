package com.hr.modules.policy.api;

import com.hr.modules.policy.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PolicyModuleApiImpl implements PolicyModuleApi {

    private final PolicyService policyService;

    @Override
    public DataScope resolveDataScope(Long userId, String resource, String viewMode) {
        return policyService.resolveDataScope(userId, resource, viewMode);
    }

    @Override
    public boolean hasPermission(Long userId, String permissionCode) {
        return policyService.hasPermission(userId, permissionCode);
    }

    @Override
    public void issueTemporaryTicket(Long targetUserId, String resource, Long resourceId, String permission, long ttlSeconds) {
        policyService.issueTemporaryTicket(targetUserId, resource, resourceId, permission, ttlSeconds);
    }
}
