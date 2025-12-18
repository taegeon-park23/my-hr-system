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
