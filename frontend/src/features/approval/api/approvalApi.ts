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

export const createApprovalRequest = async (data: Partial<ApprovalRequest>): Promise<void> => {
    await client.post('/approval/request', data);
};

