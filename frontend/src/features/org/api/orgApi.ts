import useSWR from 'swr';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { Department } from '../model/types';

export const useOrgTree = () => {
    const { data, error, isLoading } = useSWR<Department[]>(
        queryKeys.org.tree,
        fetcher
    );
    return {
        data: data || [],
        isLoading,
        isError: error
    };
};

export const getOrgTree = async (): Promise<Department[]> => {
    // Keep for backward compatibility if needed, or deprecate
    return fetcher(queryKeys.org.tree);
};

