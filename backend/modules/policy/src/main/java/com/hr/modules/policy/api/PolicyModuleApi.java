package com.hr.modules.policy.api;

public interface PolicyModuleApi {
    DataScope resolveDataScope(Long userId, String resource, String viewMode);
    boolean hasPermission(Long userId, String permissionCode);
    void issueTemporaryTicket(Long targetUserId, String resource, Long resourceId, String permission, long ttlSeconds);
}
