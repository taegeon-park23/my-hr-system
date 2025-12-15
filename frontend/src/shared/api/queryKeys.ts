export const queryKeys = {
    vacation: {
        all: ['vacation'] as const,
        // String Key Factory for SWR
        balance: (userId: number, year: number) => `/vacations/balance?year=${year}&userId=${userId}`,
        requests: (userId: number) => `/vacations/requests?userId=${userId}`,
    },
    approval: {
        all: ['approval'] as const,
        inbox: (userId: number) => `/approval/inbox`,
        outbox: (userId: number) => `/approval/outbox?userId=${userId}`,
        detail: (id: number) => `/approval/${id}`,
    },
    asset: {
        all: ['asset'] as const,
        list: (companyId: number) => `/admin/assets?companyId=${companyId}`, // Updated to admin endpoint
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
        cycles: (companyId: number) => `/admin/evaluations/cycles?companyId=${companyId}`,
        my: (userId: number) => `/evaluations/my?userId=${userId}`,
        cycleDetail: (id: number) => `/evaluations/cycles/${id}`,
    },
    org: {
        all: ['org'] as const,
        tree: (companyId: number) => `/org/tree/${companyId}`,
        dept: (id: number) => `/org/departments/${id}`,
        teamCount: (userId: number) => `/users/team-count?userId=${userId}`,
    },
    payroll: {
        all: ['payroll'] as const,
        list: '/v1/payrolls',
        my: '/v1/my-payslips',
        detail: (id: number) => `/v1/payrolls/${id}`,
    },
};
