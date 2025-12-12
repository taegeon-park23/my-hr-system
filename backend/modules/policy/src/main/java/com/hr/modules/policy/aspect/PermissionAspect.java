package com.hr.modules.policy.aspect;

import com.hr.common.security.UserPrincipal;
import com.hr.common.security.annotation.RequiresPermission;
import com.hr.modules.policy.service.PolicyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class PermissionAspect {

    private final PolicyService policyService;

    @Before("@annotation(requiresPermission)")
    public void checkPermission(RequiresPermission requiresPermission) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }

        Object principal = auth.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            // Should catch anonymousUser case
            throw new AccessDeniedException("User principal is invalid");
        }

        UserPrincipal user = (UserPrincipal) principal;
        String permissionCode = requiresPermission.value();

        if (!policyService.hasPermission(user.getId(), permissionCode)) {
            log.warn("Access Denied: User {} tried to access {} without permission", user.getEmail(), permissionCode);
            throw new AccessDeniedException("You do not have permission: " + permissionCode);
        }
    }
}
