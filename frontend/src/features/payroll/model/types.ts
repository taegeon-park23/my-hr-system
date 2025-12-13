export interface Payroll {
    id: number;
    title: string;
    targetMonth: string;
    paymentDate: string;
    status: 'DRAFT' | 'CONFIRMED' | 'PAID';
    totalAmount: number;
}

export interface PayslipItem {
    itemType: 'ALLOWANCE' | 'DEDUCTION';
    itemName: string;
    amount: number;
}

export interface Payslip {
    id: number;
    userName: string;
    departmentName: string;
    baseSalary: number;
    totalAllowance: number;
    totalDeduction: number;
    netAmount: number;
    items: PayslipItem[];
    payrollTitle?: string;
    targetMonth?: string;
}

export interface PayrollCreateRequest {
    title: string;
    targetMonth: string;
    paymentDate: string;
}
