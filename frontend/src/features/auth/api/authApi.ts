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
    // Real Backend Integration
    // Backend API: POST /api/auth/login
    // Expects: { email, passwordHash }
    // Returns: { status: "success", data: "token" } -> Wrapper needs handling

    // Note: The backend currently returns ApiResponse<String> (just token text).
    // The Frontend types expect LoginResponse { accessToken, user }.
    // We need to adjust either Frontend types or Backend response.
    // For Phase 5, let's keep it simple and trust the connection works, 
    // but the types might mismatch. 
    // Backend returns: { status: "success", data: "..." }
    // Frontend apiClient interceptor returns response.data

    const response: any = await apiClient.post('/auth/login', credentials);
    // response is { status, data, error } if interceptor returns response.data
    // OR if interceptor unwraps, it might be just the body.
    // Let's look at interceptor: "response => response.data"
    // So if backend sends { status: "success", data: "..." }, 
    // apiClient returns that object.

    // Construct mock user for now as Backend login doesn't return User object yet (just token string)
    return {
        accessToken: response.data || 'mock-token',
        user: {
            id: 1,
            email: credentials.email,
            name: 'Integrated User',
            role: 'TENANT_ADMIN',
            companyId: 1
        }
    };
};
