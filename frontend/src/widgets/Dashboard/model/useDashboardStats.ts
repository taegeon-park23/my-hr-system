import { APP_CONFIG } from '@/shared/config/constants';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { useTodoEvaluations } from '@/features/evaluation/api/evaluationApi';
import { useMyLatestPayslip } from '@/features/payroll/api/payrollApi';
import { useMyTeamCount } from '@/features/org/api/orgApi';
import { useDashboardSummary } from '@/features/dashboard/api/dashboardApi';

export const useDashboardStats = () => {
    const user = useAuthStore((state) => state.user);

    // Fetch Data
    const { balance, isLoading: isVacationLoading } = useMyVacationBalance(user?.id, APP_CONFIG.CURRENT_YEAR);
    const { todos, isLoading: isTodosLoading } = useTodoEvaluations(user?.id);
    const { payslip, isLoading: isPayslipLoading } = useMyLatestPayslip(user?.id);
    const { count: teamCount, isLoading: isTeamLoading } = useMyTeamCount(user?.id);

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
        summary: {
            data: summary,
            isLoading: isSummaryLoading && isManager,
            show: isManager
        }
    };
};
