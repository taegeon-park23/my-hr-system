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
