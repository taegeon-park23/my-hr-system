import useSWR from 'swr';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { Department } from '../model/types';

export const useOrgTree = () => {
    const { data, error, isLoading, mutate } = useSWR<Department[]>(
        queryKeys.org.tree,
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate
    };
};

export const getOrgTree = async (): Promise<Department[]> => {
    // Keep for backward compatibility if needed, or deprecate
    return fetcher(queryKeys.org.tree);
};

