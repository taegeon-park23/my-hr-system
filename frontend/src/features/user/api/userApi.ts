import useSWR from 'swr';
import { client } from '@/shared/api/client';
import { fetcher } from '@/shared/api/fetcher';

export interface User {
    id: number;
    email: string;
    name: string;
    deptId: number | null;
    role: string;
    companyId: number;
}

export interface UserSaveRequest {
    email: string;
    name: string;
    password?: string;
    deptId: number | null;
    role: string;
}

export const useUsers = (filters?: { query?: string; deptId?: number }) => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.deptId) params.append('deptId', String(filters.deptId));

    const queryString = params.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;

    const { data, error, isLoading, mutate } = useSWR<User[]>(url, fetcher);

    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useMe = () => {
    const { data, error, isLoading, mutate } = useSWR<User>('/users/me', fetcher);
    return {
        data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useUser = (id: number | null) => {
    const { data, error, isLoading, mutate } = useSWR<User>(
        id ? `/users/${id}` : null,
        fetcher
    );

    return {
        data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const createUser = async (data: UserSaveRequest) => {
    const response = await client.post('/users', data);
    return response.data;
};

export const updateUser = async (id: number, data: UserSaveRequest) => {
    const response = await client.put(`/users/${id}`, data);
    return response.data;
};
