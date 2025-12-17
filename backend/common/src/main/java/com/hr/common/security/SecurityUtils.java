package com.hr.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Long getCurrentUserId() {
        return getUserPrincipal().getId();
    }

    public static String getCurrentCompanyId() {
        return getUserPrincipal().getCompanyId();
    }

    public static String getCurrentTenantId() {
        // MVP: Use companyId as tenantId or "default"
        // In a real multi-tenant system, this might come from a header or separate claim
        return String.valueOf(getUserPrincipal().getCompanyId());
    }

    private static UserPrincipal getUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            // For development/testing without login, we might want to return a mock or throw
            // Here assuming authenticated context
            throw new IllegalStateException("No authenticated user found");
        }
        return (UserPrincipal) authentication.getPrincipal();
    }
}
