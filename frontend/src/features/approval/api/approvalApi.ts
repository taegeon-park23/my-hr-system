import { client } from '@/shared/api/client';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import useSWR from 'swr';
import { ApprovalRequest } from '../model/types';

export const useApprovalOutbox = (userId: number | undefined) => {
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

// This is effectively the Inbox (Waiting for my action)
export const useApprovalInbox = () => {
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

export const bulkApprove = async (ids: number[]): Promise<void> => {
    await client.post('/approval/bulk-approve', { ids });
};

export const bulkReject = async (ids: number[], comment?: string): Promise<void> => {
    await client.post('/approval/bulk-reject', { ids, comment });
};

export const useApprovalArchive = () => {
    const { data, error, isLoading, mutate } = useSWR<ApprovalRequest[]>(
        '/approval/archive',
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export interface ApprovalLinePreview {
    steps: {
        stepOrder: number;
        approverId: number;
        approverName: string;
    }[];
}

export const useApprovalLinePreview = (enabled: boolean = true) => {
    const { data, error, isLoading } = useSWR<ApprovalLinePreview>(
        enabled ? '/approval/line/preview' : null,
        fetcher
    );
    return {
        line: data,
        isLoading,
        isError: error
    };
};

export const useAdminApprovals = () => {
    const { data, error, isLoading, mutate } = useSWR<ApprovalRequest[]>(
        '/admin/approvals',
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export const forceApprovalDecision = async (id: number, status: 'APPROVED' | 'REJECTED', comment?: string): Promise<void> => {
    await client.post(`/admin/approvals/${id}/force-decision`, null, {
        params: { status, comment }
    });
};


