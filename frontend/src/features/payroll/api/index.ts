import useSWR from 'swr';
import axios from 'axios';
import { Payroll, PayrollCreateRequest, Payslip } from '../model/types';

// Fetcher function
const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

// 1. Get Payroll List
export function usePayrollList() {
    const { data, error, isLoading, mutate } = useSWR<Payroll[]>('/payrolls', fetcher);
    return {
        payrolls: data,
        isLoading,
        isError: error,
        mutate,
    };
}

// 2. Get Payroll Detail
export function usePayrollDetail(id: string) {
    const { data, error, isLoading } = useSWR<Payroll>(id ? `/payrolls/${id}` : null, fetcher);
    return {
        payroll: data,
        isLoading,
        isError: error,
    };
}

// 3. Get Payslips in Payroll
export function usePayslips(payrollId: string) {
    const { data, error, isLoading } = useSWR<Payslip[]>(payrollId ? `/payrolls/${payrollId}/payslips` : null, fetcher);
    return {
        payslips: data,
        isLoading,
        isError: error,
    };
}

// 4. Get My Payslips
export function useMyPayslips() {
    const { data, error, isLoading } = useSWR<Payslip[]>('/my-payslips', fetcher);
    return {
        payslips: data,
        isLoading,
        isError: error,
    };
}

// 5. Create Payroll Mutation
export async function createPayroll(data: PayrollCreateRequest) {
    const response = await axios.post('/payrolls', data);
    return response.data;
}
