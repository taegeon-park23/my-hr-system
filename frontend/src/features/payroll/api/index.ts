import useSWR from 'swr';
import { client } from '@/shared/api/client';
import { Payroll, PayrollCreateRequest, Payslip } from '../model/types';

// Fetcher function using shared client (with auth token)
const fetcher = (url: string) => client.get(url).then(res => res.data.data);

// 1. Get Payroll List
export function usePayrollList() {
    const { data, error, isLoading, mutate } = useSWR<Payroll[]>('/v1/payrolls', fetcher);
    return {
        payrolls: data,
        isLoading,
        isError: error,
        mutate,
    };
}

// 2. Get Payroll Detail
export function usePayrollDetail(id: string) {
    const { data, error, isLoading } = useSWR<Payroll>(id ? `/v1/payrolls/${id}` : null, fetcher);
    return {
        payroll: data,
        isLoading,
        isError: error,
    };
}

// 3. Get Payslips in Payroll
export function usePayslips(payrollId: string) {
    const { data, error, isLoading } = useSWR<Payslip[]>(payrollId ? `/v1/payrolls/${payrollId}/payslips` : null, fetcher);
    return {
        payslips: data,
        isLoading,
        isError: error,
    };
}

// 4. Get My Payslips
export function useMyPayslips() {
    const { data, error, isLoading } = useSWR<Payslip[]>('/v1/my-payslips', fetcher);
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
