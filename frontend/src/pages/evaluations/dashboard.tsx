import React from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { EvaluationTargetList } from "@/features/evaluation/ui/EvaluationTargetList";

const CURRENT_USER_ID = 2; // Mock User ID

export default function EvaluationDashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">인사평가 대시보드</h1>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">진행 중인 평가 (Todo)</h2>
                    <EvaluationTargetList userId={CURRENT_USER_ID} />
                </div>

                {/* Future: Add 'Completed Evaluations' list here */}
            </div>
        </DashboardLayout>
    );
}
