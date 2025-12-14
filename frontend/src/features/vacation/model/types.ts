import { VacationStatus, VacationType } from './constants';

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
    vacationType: VacationType;
    startDate: string;
    endDate: string;
    requestDays: number;
    reason: string;
    status: VacationStatus;
    createdAt: string;
}
