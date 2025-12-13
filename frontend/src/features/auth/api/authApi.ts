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


export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const data = response.data.data;

    if (!data) {
        throw new Error('No data received');
    }

    localStorage.setItem('accessToken', data.accessToken);

    return data;
};

