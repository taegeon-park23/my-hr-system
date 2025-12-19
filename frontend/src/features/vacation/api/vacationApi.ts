import { client } from '@/shared/api/client';
import { ApiResponse } from '@/shared/model/types';
import useSWR from 'swr';

import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { VacationBalance, VacationRequest } from '../model/types';

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

export function useMyVacationBalance(userId: number | undefined, year: number) {
    const { data, error, isLoading, mutate } = useSWR<VacationBalance>(
        userId ? queryKeys.vacation.balance(userId, year) : null,
        fetcher
    );

    return {
        balance: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useMyVacationRequests(userId: number | undefined) {
    const { data, error, isLoading } = useSWR<VacationRequest[]>(
        userId ? queryKeys.vacation.requests(userId) : null,
        fetcher
    );

    return {
        requests: data || [],
        isLoading,
        isError: error,
    };
}

export interface TeamVacation {
    userName: string;
    startDate: string;
    endDate: string;
    type: string;
}

export function useTeamVacations() {
    const { data, error, isLoading } = useSWR<TeamVacation[]>(
        '/vacations/team',
        (url) => client.get(url).then(res => res.data)
    );

    return {
        teamVacations: data || [],
        isLoading,
        isError: error
    };
}

