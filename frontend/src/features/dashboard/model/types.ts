export interface DashboardSummary {
    totalEmployees: number;
    pendingApprovals: number;
    approvedApprovals: number;
    rejectedApprovals: number;
    todayAttendance: number;
}

export interface DepartmentStat {
    deptId: number;
    deptName: string;
    headcount: number;
}
