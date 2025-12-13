import { client } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

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

export const getMyVacationBalance = async (): Promise<VacationBalance> => {
    // Legacy support or direct use
    // Using default user ID 1 for now as per legacy code implicit assumption if any
    return vacationApi.getMyBalance(2025, 1);
};
