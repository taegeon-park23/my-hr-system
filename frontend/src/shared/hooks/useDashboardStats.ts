import { APP_CONFIG } from '@/shared/config/constants';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { useTodoEvaluations } from '@/features/evaluation/api/evaluationApi';

export const useDashboardStats = () => {
    const user = useAuthStore((state) => state.user);

    // Fetch Vacation Balance
    const { balance, isLoading: isBalanceLoading } = useMyVacationBalance(user?.id, APP_CONFIG.CURRENT_YEAR);

    // Fetch Pending Todos (Evaluations for now)
    const { todos, isLoading: isTodosLoading } = useTodoEvaluations(user?.id);

    // Derived Logic
    const vacationDisplay = isBalanceLoading
        ? "Loading..."
        : balance
            ? `${balance.remainingDays} Days`
            : "0 Days";

    const pendingCount = isTodosLoading
        ? "..."
        : todos ? todos.length : 0;

    return {
        vacation: {
            display: vacationDisplay,
            isLoading: isBalanceLoading
        },
        pendingTasks: {
            count: pendingCount,
            isLoading: isTodosLoading
        },
        // Placeholders for future APIs
        payslip: {
            status: "Available", // Hardcoded for now
            isLoading: false
        },
        team: {
            count: "-", // Hardcoded for now
            isLoading: false
        }
    };
};
