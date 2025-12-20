import { APP_CONFIG } from '@/shared/config/constants';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { useTodoEvaluations } from '@/features/evaluation/api/evaluationApi';
import { useMyLatestPayslip } from '@/features/payroll/api/payrollApi';
import { useMyTeamCount } from '@/features/org/api/orgApi';
import { useDashboardSummary, useMyApprovalStats } from '@/features/dashboard/api/dashboardApi';
import { useAttendanceSummary } from '@/features/attendance/api/attendanceApi';

export const useDashboardStats = () => {
    const user = useAuthStore((state) => state.user);

    // Fetch Data
    const { balance, isLoading: isVacationLoading } = useMyVacationBalance(user?.id, APP_CONFIG.CURRENT_YEAR);
    const { todos, isLoading: isTodosLoading } = useTodoEvaluations(user?.id);
    const { payslip, isLoading: isPayslipLoading } = useMyLatestPayslip(user?.id);
    const { count: teamCount, isLoading: isTeamLoading } = useMyTeamCount(user?.id);
    const { stats: approvalStats, isLoading: isApprovalLoading } = useMyApprovalStats();

    // Attendance for today check
    const now = new Date();
    const { data: attendanceSummary, isLoading: isAttendanceLoading } = useAttendanceSummary(now.getFullYear(), now.getMonth() + 1);

    // Summary data for managers/admins
    const isManager = user?.role !== 'USER';
    const { summary, isLoading: isSummaryLoading } = useDashboardSummary();

    return {
        vacation: {
            balance,
            isLoading: isVacationLoading
        },
        pendingTasks: {
            count: todos ? todos.length : 0,
            isLoading: isTodosLoading
        },
        payslip: {
            data: payslip,
            isLoading: isPayslipLoading
        },
        team: {
            count: teamCount || 0,
            isLoading: isTeamLoading
        },
        approval: {
            stats: approvalStats,
            isLoading: isApprovalLoading
        },
        attendance: {
            summary: attendanceSummary,
            isLoading: isAttendanceLoading
        },
        summary: {
            data: summary,
            isLoading: isSummaryLoading && isManager,
            show: isManager
        }
    };
};
