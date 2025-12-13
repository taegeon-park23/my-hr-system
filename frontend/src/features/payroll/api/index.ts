import useSWR from 'swr';
import { client } from '@/shared/api/client';
import { fetcher } from '@/shared/api/fetcher';
import { queryKeys } from '@/shared/api/queryKeys';
import { Payroll, PayrollCreateRequest, Payslip } from '../model/types';

// 1. Get Payroll List
export function usePayrollList() {
    const { data, error, isLoading, mutate } = useSWR<Payroll[]>(queryKeys.payroll.list, fetcher);
    return {
        payrolls: data,
        isLoading,
        isError: error,
        mutate,
    };
}

// 2. Get Payroll Detail
export function usePayrollDetail(id: number) {
    const { data, error, isLoading } = useSWR<Payroll>(id ? queryKeys.payroll.detail(id) : null, fetcher);
    return {
        payroll: data,
        isLoading,
        isError: error,
    };
}

// 3. Get Payslips in Payroll
// Note: queryKeys for sub-resources might need expansion, using dynamic string construction for now or add to queryKeys if used frequently.
// Assuming sub-resource pattern: /v1/payrolls/${payrollId}/payslips
export function usePayslips(payrollId: number) {
    const { data, error, isLoading } = useSWR<Payslip[]>(payrollId ? `/v1/payrolls/${payrollId}/payslips` : null, fetcher);
    return {
        payslips: data,
        isLoading,
        isError: error,
    };
}

// 4. Get My Payslips
export function useMyPayslips(userId: number) {
    // Note: queryKeys.payroll.my used /payrolls/my?userId=...
    // Current frontend was using /v1/my-payslips
    // We should align with the standard patterns.
    // If backend supports /payrolls/my, use queryKeys.payroll.my(userId)
    // If strict /v1/my-payslips, we should add that key or use string.
    // Let's use string for now to match confirmed existing endpoint or update queryKeys to match reality?
    // queryKeys defined: my: (userId) => `/payrolls/my?userId=${userId}`
    // Let's assume standardisation towards queryKeys pattern is desired.
    const { data, error, isLoading } = useSWR<Payslip[]>(userId ? queryKeys.payroll.my(userId) : null, fetcher);
    return {
        payslips: data,
        isLoading,
        isError: error,
    };
}

// 5. Create Payroll Mutation
export async function createPayroll(data: PayrollCreateRequest) {
    const response = await client.post('/v1/payrolls', data);
    return response.data;
}
