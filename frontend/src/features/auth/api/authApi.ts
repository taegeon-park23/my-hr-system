import { client } from '@/shared/api/client';
import { ApiResponse, User } from '@/shared/model/types';


export interface LoginRequest {
    email: string;
    password: string;
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

    // Token is handled by the caller (store) or useAuthStore logic
    // localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken); // Removed in favor of Cookie approach handled by store

    return data;
};


