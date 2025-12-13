export const queryKeys = {
    vacation: {
        all: ['vacation'] as const,
        // String Key Factory for SWR
        balance: (userId: number, year: number) => `/vacations/balance?year=${year}&userId=${userId}`,
        requests: (userId: number) => `/vacations/requests?userId=${userId}`,
    },
    approval: {
        all: ['approval'] as const,
        inbox: (userId: number) => `/approval/inbox?userId=${userId}`,
        outbox: (userId: number) => `/approval/outbox?userId=${userId}`,
        detail: (id: number) => `/approval/${id}`,
    },
    asset: {
        all: ['asset'] as const,
        list: '/assets',
        my: (userId: number) => `/assets/my?userId=${userId}`,
        detail: (id: number) => `/assets/${id}`,
    },
    attendance: {
        all: ['attendance'] as const,
        today: (userId: number) => `/attendance/today?userId=${userId}`,
        monthly: (userId: number, year: number, month: number) => `/attendance/monthly?userId=${userId}&year=${year}&month=${month}`,
    },
    auth: {
        all: ['auth'] as const,
        me: '/auth/me',
    },
    evaluation: {
        all: ['evaluation'] as const,
        cycles: '/evaluations/cycles',
        my: (userId: number) => `/evaluations/my?userId=${userId}`,
        cycleDetail: (id: number) => `/evaluations/cycles/${id}`,
    },
    org: {
        all: ['org'] as const,
        tree: '/org/tree',
        dept: (id: number) => `/org/departments/${id}`,
    },
    payroll: {
        all: ['payroll'] as const,
        list: '/payrolls',
        my: (userId: number) => `/payrolls/my?userId=${userId}`,
        detail: (id: number) => `/payrolls/${id}`,
    },
};
