export interface ApprovalRequest {
    id: number;
    companyId: number;
    requesterId: number;
    requesterName: string;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    type: 'VACATION' | 'EXPENSE' | 'EQUIPMENT';
    steps?: ApprovalStep[];
}

export interface ApprovalStep {
    id: number;
    stepOrder: number;
    approverId: number;
    approverName: string;
    status: 'WAITING' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
    comment?: string;
    processedAt?: string;
}
