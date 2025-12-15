import useSWR from "swr";
import { client } from "@/shared/api/client";
import { fetcher } from "@/shared/api/fetcher";
import { queryKeys } from "@/shared/api/queryKeys";
import { CreateCycleRequest, EvaluationCycle, EvaluationRecord } from "../model/types";

// --- Admin ---

export function useEvaluationCycles(companyId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<EvaluationCycle[]>(
        companyId ? queryKeys.evaluation.cycles(companyId) : null,
        fetcher
    );

    return {
        cycles: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export async function createEvaluationCycle(data: CreateCycleRequest) {
    const response = await client.post(`/admin/evaluations/cycles`, data);
    return response.data;
}

export async function startEvaluationCycle(id: number) {
    const response = await client.post(`/admin/evaluations/cycles/${id}/start`);
    return response.data;
}

export async function closeEvaluationCycle(id: number) {
    const response = await client.post(`/admin/evaluations/cycles/${id}/close`);
    return response.data;
}

// --- User ---

export function useTodoEvaluations(userId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<EvaluationRecord[]>(
        userId ? queryKeys.evaluation.my(userId) : null,
        fetcher
    );

    return {
        todos: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export async function submitEvaluation(recordId: number, data: { score: number; comment: string }) {
    const response = await client.post(`/evaluations/records/${recordId}/submit`, data);
    return response.data;
}
