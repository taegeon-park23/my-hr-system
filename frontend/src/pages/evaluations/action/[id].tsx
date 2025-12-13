import React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/app/dashboard/layout";
import { EvaluationForm } from "@/features/evaluation/ui/EvaluationForm";

export default function EvaluationActionPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">평가 수행</h1>
                <p className="text-gray-500">대상자에 대한 공정한 평가를 부탁드립니다.</p>

                <EvaluationForm recordId={Number(id)} />
            </div>
        </DashboardLayout>
    );
}
