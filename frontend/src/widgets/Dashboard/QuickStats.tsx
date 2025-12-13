import React from 'react';

interface StatProps {
    label: string;
    value: string | number;
    color?: string;
}

const StatCard = ({ label, value, color = "text-gray-900" }: StatProps) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
            <dd className={`mt-1 text-3xl font-semibold ${color}`}>{value}</dd>
        </div>
    </div>
);

import { APP_CONFIG } from '@/shared/config/constants';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { useTodoEvaluations } from '@/features/evaluation/api/evaluationApi';

export const QuickStats = () => {
    const user = useAuthStore((state) => state.user);

    // Hooks should be called unconditionally, but we pass null if user is undefined to skip fetching
    const { balance, isLoading: isBalanceLoading } = useMyVacationBalance(user?.id, APP_CONFIG.CURRENT_YEAR);

    const { todos, isLoading: isTodosLoading } = useTodoEvaluations(user?.id);

    // Format Vacation
    const vacationDisplay = isBalanceLoading
        ? "Loading..."
        : balance
            ? `${balance.remainingDays} Days`
            : "0 Days";

    // Format Approvals / Todos
    // NOTE: "Pending Approvals" usually refers to approval requests I need to approve (as a manager).
    // "Todos" from evaluation might be self/peer evals I need to do.
    // Ideally we need an `usePendingApprovals` hook from Approval module. 
    // For now, let's fallback to Evaluation Todos as a placeholder for "Pending Actions" or rename the card.
    // Or if the user meant "Pending Approvals" as "My requests pending", that's different.
    // Let's assume the label "Pending Actions" is better if we mix them, but we stick to the label "Pending Approvals" 
    // and maybe show "0" if we don't have that API yet, OR show evaluation todos count.
    // Let's us Evaluation Todos count for now and label it accordingly or just keep as is.
    const pendingCount = todos ? todos.length : 0;

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard label="Remaining Vacation" value={vacationDisplay} color="text-green-600" />
            <StatCard label="Pending Evaluations" value={isTodosLoading ? "..." : pendingCount} color="text-yellow-600" />
            <StatCard label="Payslip (Dec)" value="Available" color="text-blue-600" />
            <StatCard label="Team Members" value="-" />
        </div>
    );
};
