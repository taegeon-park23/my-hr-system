import { Payroll } from '../model/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Props {
    data: Payroll[];
    onViewDetail: (id: number) => void;
}

import { PayrollStatus } from '../model/constants';

export function PayrollListTable({ data, onViewDetail }: Props) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case PayrollStatus.CONFIRMED: return 'success';
            case PayrollStatus.PAID: return 'info';
            default: return 'secondary';
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>귀속월</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>지급일</TableHead>
                    <TableHead>총 지급액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((payroll) => (
                    <TableRow key={payroll.id}>
                        <TableCell className="font-medium text-gray-900">{payroll.targetMonth}</TableCell>
                        <TableCell>{payroll.title}</TableCell>
                        <TableCell>{payroll.paymentDate}</TableCell>
                        <TableCell>{payroll.totalAmount.toLocaleString()}원</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(payroll.status)}>
                                {payroll.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onViewDetail(payroll.id)}
                            >
                                상세보기
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                {data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            데이터가 없습니다.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
