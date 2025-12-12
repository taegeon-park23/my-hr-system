import { VacationBalance } from '../model/types';

export const getMyVacationBalance = async (): Promise<VacationBalance> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                userId: 1,
                year: 2024,
                totalDays: 15,
                usedDays: 3.5,
                remainingDays: 11.5
            });
        }, 400);
    });
};
