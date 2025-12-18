import { client } from '@/shared/api/client';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import useSWR from 'swr';
import { ApprovalRequest } from '../model/types';

export const useApprovalInbox = (userId: number | undefined) => {
    const { data, error, isLoading, mutate } = useSWR<ApprovalRequest[]>(
        userId ? queryKeys.approval.inbox(userId) : null,
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export const usePendingApprovals = () => {
    const { data, error, isLoading, mutate } = useSWR<ApprovalRequest[]>(
        '/approval/pending',
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export const useApprovalDetail = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR<ApprovalRequest>(
        queryKeys.approval.detail(id),
        fetcher
    );
    return {
        data,
        isLoading,
        isError: error,
        mutate
    };
};

export const createApprovalRequest = async (data: Partial<ApprovalRequest>): Promise<void> => {
    await client.post('/approval/request', data);
};

export const approveStep = async (stepId: number, comment?: string): Promise<void> => {
    await client.post(`/approval/steps/${stepId}/approve`, { comment });
};

export const rejectStep = async (stepId: number, comment?: string): Promise<void> => {
    await client.post(`/approval/steps/${stepId}/reject`, { comment });
};

