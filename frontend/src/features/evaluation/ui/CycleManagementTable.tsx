import React from "react";
import { useEvaluationCycles, startEvaluationCycle, closeEvaluationCycle } from "../api/evaluationApi";
import { EvaluationCycle, CycleStatus } from "../model/types";
import { Button } from "@/shared/ui/Button";

interface Props {
    companyId: number;
}

export function CycleManagementTable({ companyId }: Props) {
    const { cycles, isLoading, mutate } = useEvaluationCycles(companyId);

    const handleStart = async (id: number) => {
        if (!confirm("평가를 시작하시겠습니까? 대상자의 평가 데이터가 생성됩니다.")) return;
        try {
            await startEvaluationCycle(id);
            mutate();
        } catch {
            alert("시작 처리에 실패했습니다.");
        }
    };

    const handleClose = async (id: number) => {
        if (!confirm("평가를 마감하시겠습니까? 더 이상 제출할 수 없습니다.")) return;
        try {
            await closeEvaluationCycle(id);
            mutate();
        } catch {
            alert("마감 처리에 실패했습니다.");
        }
    };

    if (isLoading) return <div>Loading cycles...</div>;
    if (!cycles || cycles.length === 0) return <div className="p-4 text-gray-500">등록된 평가 회차가 없습니다.</div>;

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연도/유형</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {cycles.map((cycle) => (
                        <tr key={cycle.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cycle.year} / {cycle.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cycle.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cycle.startDate} ~ {cycle.endDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold
                  ${cycle.status === CycleStatus.OPEN ? "bg-green-100 text-green-800" :
                                        cycle.status === CycleStatus.CLOSED ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {cycle.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {cycle.status === CycleStatus.DRAFT && (
                                    <Button size="sm" onClick={() => handleStart(cycle.id)}>시작</Button>
                                )}
                                {cycle.status === CycleStatus.OPEN && (
                                    <Button size="sm" variant="danger" onClick={() => handleClose(cycle.id)}>마감</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
