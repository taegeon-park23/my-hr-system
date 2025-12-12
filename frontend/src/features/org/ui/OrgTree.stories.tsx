import type { Meta, StoryObj } from '@storybook/react';
import { OrgTree } from './OrgTree';
import { Department } from '../model/types';

const meta: Meta<typeof OrgTree> = {
    title: 'Features/Org/OrgTree',
    component: OrgTree,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrgTree>;

const MOCK_DATA: Department[] = [
    {
        id: 1,
        companyId: 1,
        parentId: null,
        name: 'CEO Office',
        depth: 0,
        children: [
            {
                id: 2,
                companyId: 1,
                parentId: 1,
                name: 'Engineering',
                depth: 1,
                children: [
                    { id: 4, companyId: 1, parentId: 2, name: 'Frontend', depth: 2, children: [] },
                    { id: 5, companyId: 1, parentId: 2, name: 'Backend', depth: 2, children: [] },
                ],
            },
            {
                id: 3,
                companyId: 1,
                parentId: 1,
                name: 'HR Team',
                depth: 1,
                children: [],
            },
        ],
    },
];

export const Default: Story = {
    args: {
        nodes: MOCK_DATA,
    },
};
