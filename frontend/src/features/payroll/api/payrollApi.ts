import useSWR from 'swr';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { PayslipSummary } from '../model/types';

export function useMyLatestPayslip(userId: number | undefined) {
    const { data, error, isLoading } = useSWR<PayslipSummary[]>(
        userId ? queryKeys.payroll.my : null,
        fetcher
    );

    // Assuming existing API returns list, get latest
    const latest = data && data.length > 0 ? data[0] : null;

    return {
        payslip: latest,
        isLoading,
        isError: error,
    };
}
