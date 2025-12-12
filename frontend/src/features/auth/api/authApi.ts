import axios from 'axios';

// Generic API Client foundation
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        return Promise.reject(error.response?.data?.error || { message: 'Network error occurred' });
    }
);

// Auth Specific Types
export interface LoginRequest {
    email: string;
    passwordHash: string; // In real app, name might just be 'password' but following DB schema implied naming or standard
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DEPT_MANAGER' | 'USER';
    companyId: number;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

// Auth API Hooks (Simulated for Phase 2 without real backend connection yet)
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Mock response for Phase 2 frontend dev
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                accessToken: 'mock-jwt-token',
                user: {
                    id: 1,
                    email: credentials.email,
                    name: 'Hong Gil Dong',
                    role: 'TENANT_ADMIN',
                    companyId: 100,
                },
            });
        }, 1000);
    });
};
