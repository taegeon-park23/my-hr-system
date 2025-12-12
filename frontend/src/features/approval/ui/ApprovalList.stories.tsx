import type { Meta, StoryObj } from '@storybook/react';
import { ApprovalList } from './ApprovalList';

const meta: Meta<typeof ApprovalList> = {
    title: 'Features/Approval/ApprovalList',
    component: ApprovalList,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApprovalList>;

export const Default: Story = {
    args: {
        requests: [
            {
                id: 1,
                companyId: 100,
                requesterId: 10,
                requesterName: 'John Doe',
                title: 'Annual Leave Request',
                status: 'PENDING',
                createdAt: '2024-12-10T09:00:00Z',
                type: 'VACATION',
            },
            {
                id: 2,
                companyId: 100,
                requesterId: 10,
                requesterName: 'John Doe',
                title: 'New Monitor',
                status: 'APPROVED',
                createdAt: '2024-12-05T10:00:00Z',
                type: 'EQUIPMENT',
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        requests: [],
    },
};
