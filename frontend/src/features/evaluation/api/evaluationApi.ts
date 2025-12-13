import axios from "axios";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export enum CycleStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED",
}

export enum EvaluationType {
    PERFORMANCE = "PERFORMANCE",
    COMPETENCY = "COMPETENCY",
    KPI = "KPI",
}

export interface EvaluationCycle {
    id: number;
    companyId: number;
    title: string;
    year: number;
    type: EvaluationType;
    startDate: string;
    endDate: string;
    status: CycleStatus;
}

export interface CreateCycleRequest {
    companyId: number;
    title: string;
    year: number;
    type: EvaluationType;
    startDate: string;
    endDate: string;
}

export interface EvaluationRecord {
    id: number;
    evaluationId: number;
    raterUserId: number;
    raterType: "SELF" | "PEER" | "MANAGER";
    score: number;
    comment: string | null;
    submittedAt: string | null;
    targetUserName?: string; // Optional for display
    cycleTitle?: string; // Optional for display
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// --- Admin ---

export function useEvaluationCycles(companyId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<EvaluationCycle[]>(
        companyId ? `${API_URL}/api/admin/evaluations/cycles?companyId=${companyId}` : null,
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
    const response = await axios.post(`${API_URL}/api/admin/evaluations/cycles`, data);
    return response.data;
}

export async function startEvaluationCycle(id: number) {
    const response = await axios.post(`${API_URL}/api/admin/evaluations/cycles/${id}/start`);
    return response.data;
}

export async function closeEvaluationCycle(id: number) {
    const response = await axios.post(`${API_URL}/api/admin/evaluations/cycles/${id}/close`);
    return response.data;
}

// --- User ---

export function useTodoEvaluations(userId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<EvaluationRecord[]>(
        userId ? `${API_URL}/api/evaluations/todo?userId=${userId}` : null,
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
    const response = await axios.post(`${API_URL}/api/evaluations/records/${recordId}/submit`, data);
    return response.data;
}
