export const queryKeys = {
    vacation: {
        all: ['vacation'] as const,
        // String Key Factory for SWR
        balance: (userId: number, year: number) => `/vacations/balance?year=${year}&userId=${userId}`,
        requests: (userId: number) => `/vacations/requests?userId=${userId}`,
    },
    // Add other keys as needed
};
