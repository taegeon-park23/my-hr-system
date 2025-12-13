import { client } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import useSWR from 'swr';

export interface VacationBalance {
    id: number;
    companyId: number;
    userId: number;
    year: number;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface VacationRequest {
    id: number;
    vacationType: 'ANNUAL' | 'HALF_AM' | 'HALF_PM' | 'SICK' | 'UNPAID';
    startDate: string;
    endDate: string;
    requestDays: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

export const vacationApi = {
    getMyBalance: async (year: number, userId: number) => {
        const response = await client.get<ApiResponse<VacationBalance>>(`/vacations/balance?year=${year}&userId=${userId}`);
        return response.data.data;
    },

    getMyRequests: async (userId: number) => {
        const response = await client.get<ApiResponse<VacationRequest[]>>(`/vacations/requests?userId=${userId}`);
        return response.data.data;
    },

    requestVacation: async (data: {
        userId: number;
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
    }) => {
        const response = await client.post<ApiResponse<VacationRequest>>(`/vacations/request?userId=${data.userId}`, data);
        return response.data.data;
    },
};


const fetcher = (url: string) => client.get(url).then((res) => res.data.data);

export function useMyVacationBalance(userId: number | undefined, year: number) {
    const { data, error, isLoading } = useSWR<VacationBalance>(
        userId ? `/vacations/balance?year=${year}&userId=${userId}` : null,
        fetcher
    );

    return {
        balance: data,
        isLoading,
        isError: error,
    };
}
