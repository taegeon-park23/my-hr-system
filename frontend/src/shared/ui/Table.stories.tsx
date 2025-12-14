import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './Table';
import { Badge } from './Badge';

const meta = {
    title: 'Shared/Table',
    component: Table,
    tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Table>
            <TableCaption>A list of recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV-001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">INV-002</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">INV-003</TableCell>
                    <TableCell>Unpaid</TableCell>
                    <TableCell>Bank Transfer</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$750.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    ),
};

export const WithBadges: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Frontend Refactoring</TableCell>
                    <TableCell><Badge variant="warning">In Progress</Badge></TableCell>
                    <TableCell className="text-right">High</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Backend API</TableCell>
                    <TableCell><Badge variant="success">Completed</Badge></TableCell>
                    <TableCell className="text-right">Medium</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};
