'use client';

import { fetcher } from '@/shared/api/fetcher';
import useSWR from 'swr';
import { DashboardSummary, DepartmentStat } from '../model/types';

export const useDashboardSummary = () => {
    const { data, error, isLoading, mutate } = useSWR<DashboardSummary>(
        '/dashboard/summary',
        fetcher
    );
    return {
        summary: data,
        isLoading,
        isError: error,
        mutate
    };
};

export const useDepartmentStats = () => {
    const { data, error, isLoading } = useSWR<DepartmentStat[]>(
        '/dashboard/dept-stats',
        fetcher
    );
    return {
        stats: data || [],
        isLoading,
        isError: error
    };
};

export interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    type: string;
}

export const useAnnouncements = () => {
    const { data, error, isLoading } = useSWR<Announcement[]>(
        '/notifications/announcements',
        fetcher
    );
    return {
        announcements: data || [],
        isLoading,
        isError: error
    };
};

export interface MyApprovalStats {
    pendingCount: number; // Docs I need to approve
    inProgressCount: number; // My docs currently in progress
}

export const useMyApprovalStats = () => {
    const { data, error, isLoading } = useSWR<MyApprovalStats>(
        '/dashboard/my-approval-stats',
        fetcher
    );
    return {
        stats: data,
        isLoading,
        isError: error
    };
};

