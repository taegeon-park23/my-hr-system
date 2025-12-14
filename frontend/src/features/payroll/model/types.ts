import { PayrollStatus } from './constants';

export interface PayslipSummary {
    id: number;
    year: number;
    month: number;
    totalAmount: number;
    paymentDate: string;
}

export interface Payroll {
    id: number;
    title: string;
    targetMonth: string;
    paymentDate: string;
    totalAmount: number;
    status: PayrollStatus;
}

export interface PayrollCreateRequest {
    title: string;
    targetMonth: string;
    paymentDate: string;
}

export interface PayslipItem {
    itemType: 'ALLOWANCE' | 'DEDUCTION';
    itemName: string;
    amount: number;
}

export interface Payslip {
    id: number;
    payrollId: number;
    userId: number;
    payrollTitle: string;
    targetMonth: string;
    userName: string;
    departmentName: string;
    baseSalary: number;
    totalAllowance: number;
    totalDeduction: number;
    netAmount: number;
    items: PayslipItem[];
}
