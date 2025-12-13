import useSWR from 'swr';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { Department, TeamCountResponse } from '../model/types';

export function useMyTeamCount(userId: number | undefined) {
    const { data, error, isLoading } = useSWR<TeamCountResponse>(
        userId ? queryKeys.org.teamCount(userId) : null,
        fetcher
    );

    return {
        count: data?.count,
        isLoading,
        isError: error,
    };
}

export function useOrgTree() {
    const { data, error, isLoading, mutate } = useSWR<Department[]>(
        queryKeys.org.tree,
        fetcher
    );

    return {
        data,
        isLoading,
        isError: error,
        mutate,
    };
}
