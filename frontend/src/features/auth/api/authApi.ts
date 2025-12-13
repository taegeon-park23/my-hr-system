import { client } from '../../../shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface LoginRequest {
    email: string;
    password: string;
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

interface JwtClaims {
    sub: string;
    email: string;
    role: User['role'];
    companyId: string;
    exp: number;
    iat: number;
}

function parseJwt(token: string): JwtClaims | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload) as JwtClaims;
    } catch (e) {
        return null;
    }
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<ApiResponse<string>>('/auth/login', credentials);
    const token = response.data.data;

    if (!token) {
        throw new Error('No access token received');
    }

    const claims = parseJwt(token);

    if (!claims) {
        throw new Error('Invalid token');
    }

    const user: User = {
        id: Number(claims.sub),
        email: claims.email,
        name: claims.email.split('@')[0],
        role: claims.role,
        companyId: Number(claims.companyId)
    };

    localStorage.setItem('accessToken', token);

    return {
        accessToken: token,
        user
    };
};

