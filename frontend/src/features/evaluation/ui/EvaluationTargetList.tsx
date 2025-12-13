import React from "react";
import Link from "next/link";
import { useTodoEvaluations } from "../api/evaluationApi";
import { EvaluationRecord } from "../model/types";
import { Button } from "@/shared/ui/Button";

interface Props {
    userId: number;
}

export function EvaluationTargetList({ userId }: Props) {
    const { todos, isLoading } = useTodoEvaluations(userId);

    if (isLoading) return <div>Loading todos...</div>;
    if (!todos || todos.length === 0) return <div className="p-10 text-center text-gray-500 border rounded bg-white">현재 진행 중인 평가가 없습니다.</div>;

    return (
        <div className="bg-white rounded shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {todos.map((record) => (
                    <li key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                            <p className="text-sm font-bold text-indigo-600">{record.cycleTitle || "평가"}</p>
                            <h3 className="text-lg font-medium text-gray-900">
                                {record.raterType === "SELF" ? "본인 평가" : `${record.targetUserName}님 동료 평가`}
                            </h3>
                            <p className="text-sm text-gray-500">유형: {record.raterType}</p>
                        </div>
                        <Link href={`/evaluations/action/${record.id}`}>
                            <Button size="sm">평가하기</Button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
