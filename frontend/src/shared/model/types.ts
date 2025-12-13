export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DEPT_MANAGER' | 'USER';

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    companyId: number;
    departmentId?: number; // Added as optional for future
    position?: string;     // Added as optional for future
}

export interface ApiError {
    code: string;
    message: string;
    details?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: ApiError;
    timestamp?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}
