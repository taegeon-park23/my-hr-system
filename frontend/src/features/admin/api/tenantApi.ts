import { client } from '@/shared/api/client';
import { fetcher } from '@/shared/api/fetcher';
import useSWR from 'swr';
import { ApiResponse } from '@/shared/model/types';

export interface Tenant {
    id: number;
    name: string;
    domain: string;
    adminEmail: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}

export const useTenants = () => {
    const { data, error, isLoading, mutate } = useSWR<Tenant[]>(
        '/tenants',
        fetcher
    );
    return {
        tenants: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export const createTenant = async (data: Partial<Tenant>): Promise<void> => {
    await client.post('/tenants', data);
};

export const deleteTenant = async (id: number): Promise<void> => {
    await client.delete(`/tenants/${id}`);
};

export const impersonateTenant = async (tenantId: number): Promise<{ accessToken: string }> => {
    const response = await client.post<ApiResponse<{ accessToken: string }>>(`/tenants/impersonate?tenantId=${tenantId}`);
    return response.data.data;
};
