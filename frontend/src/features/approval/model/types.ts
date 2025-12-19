export interface ApprovalRequest {
    id: number;
    companyId: number;
    requesterUserId: number;
    requesterName?: string;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
    createdAt: string;
    resourceType: string;
    resourceId?: number;
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
