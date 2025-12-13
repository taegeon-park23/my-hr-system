import { User, UserRole } from "../model/types";

// Role hierarchy definition (Lowest to Highest)
const ROLE_HIERARCHY: UserRole[] = ['USER', 'DEPT_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN'];

export function hasPermission(user: User | null | undefined, requiredRole?: UserRole): boolean {
    if (!requiredRole) return true;
    if (!user) return false;

    const userRoleIndex = ROLE_HIERARCHY.indexOf(user.role);
    const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

    if (userRoleIndex === -1 || requiredRoleIndex === -1) return false;

    return userRoleIndex >= requiredRoleIndex;
}
