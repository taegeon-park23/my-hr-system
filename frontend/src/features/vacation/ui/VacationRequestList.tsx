import React from 'react';
import { VacationRequest } from '../model/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';

interface Props {
    requests: VacationRequest[];
    isLoading: boolean;
}

export const VacationRequestList: React.FC<Props> = ({ requests, isLoading }) => {
    if (isLoading) {
        return <div className="p-6 bg-white rounded-lg shadow animate-pulse">Loading...</div>;
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'destructive';
            default: return 'warning';
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>신청일</TableHead>
                    <TableHead>휴가 종류</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>일수</TableHead>
                    <TableHead>상태</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell className="text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-900">
                            {req.vacationType}
                        </TableCell>
                        <TableCell className="text-gray-500">
                            {req.startDate} ~ {req.endDate}
                        </TableCell>
                        <TableCell className="text-gray-500">
                            {req.requestDays}
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(req.status)}>
                                {req.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
                {requests.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                            신청 내역이 없습니다.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
