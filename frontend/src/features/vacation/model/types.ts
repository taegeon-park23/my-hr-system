export interface VacationBalance {
    id: number;
    companyId: number;
    userId: number;
    year: number;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface VacationRequest {
    id: number;
    vacationType: 'ANNUAL' | 'HALF_AM' | 'HALF_PM' | 'SICK' | 'UNPAID';
    startDate: string;
    endDate: string;
    requestDays: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}
