import { client } from '../../../shared/api/client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    name: string; // token doesn't have name, usage might need adjustment or fetch profile
    role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DEPT_MANAGER' | 'USER';
    companyId: number;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Backend returns ApiResponse<String> which is { status: "success", data: "token", ... }
    const response = await client.post('/auth/login', credentials);
    const token = response.data.data; // Wrapper: response.data is Envelope, .data is payload

    if (!token) {
        throw new Error('No access token received');
    }

    const claims = parseJwt(token);

    // Construct User from Token Claims
    // Claims: subject(id), email, role, companyId
    const user: User = {
        id: Number(claims.sub),
        email: claims.email,
        name: claims.email.split('@')[0], // Fallback name
        role: claims.role,
        companyId: Number(claims.companyId)
    };

    // Auto-save to localStorage for persistence
    localStorage.setItem('accessToken', token);

    return {
        accessToken: token,
        user
    };
};

