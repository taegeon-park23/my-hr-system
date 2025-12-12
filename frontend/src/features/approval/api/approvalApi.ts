import { ApprovalRequest } from '../model/types';

const MOCK_APPROVALS: ApprovalRequest[] = [
    {
        id: 1,
        companyId: 100,
        requesterId: 10,
        requesterName: 'Kim Staff',
        title: 'Vacation Request (Summer)',
        status: 'PENDING',
        createdAt: '2024-06-12T09:00:00Z',
        type: 'VACATION',
    },
    {
        id: 2,
        companyId: 100,
        requesterId: 10,
        requesterName: 'Kim Staff',
        title: 'MacBook Pro Request',
        status: 'APPROVED',
        createdAt: '2024-05-20T14:30:00Z',
        type: 'EQUIPMENT',
    },
];

export const getApprovalList = async (): Promise<ApprovalRequest[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_APPROVALS);
        }, 600);
    });
};

export const createApprovalRequest = async (data: Partial<ApprovalRequest>): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Created Approval:', data);
            resolve();
        }, 1000);
    });
};
