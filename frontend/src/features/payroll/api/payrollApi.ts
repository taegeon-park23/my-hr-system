import { PayrollStub } from '../model/types';

const MOCK_PAYROLLS: PayrollStub[] = [
    {
        id: 1,
        userId: 1,
        targetYear: 2024,
        targetMonth: 11,
        paymentDate: '2024-11-25',
        totalAmount: 5000000,
        taxAmount: 500000,
        insuranceAmount: 300000,
        netAmount: 4200000,
        status: 'PAID'
    },
    {
        id: 2,
        userId: 1,
        targetYear: 2024,
        targetMonth: 12,
        paymentDate: '2024-12-25',
        totalAmount: 5000000,
        taxAmount: 500000,
        insuranceAmount: 300000,
        netAmount: 4200000,
        status: 'CONFIRMED'
    },
];

export const getMyPayrolls = async (): Promise<PayrollStub[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PAYROLLS);
        }, 700);
    });
};
