export interface PayrollStub {
    id: number;
    userId: number;
    targetYear: number;
    targetMonth: number;
    paymentDate: string;
    totalAmount: number;
    status: 'DRAFT' | 'CONFIRMED' | 'PAID';
    taxAmount: number;
    insuranceAmount: number;
    netAmount: number;
}
