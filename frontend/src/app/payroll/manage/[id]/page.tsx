'use client';

import { useParams } from 'next/navigation';
import { usePayrollDetail, usePayslips } from '@/features/payroll/api';
import { PayslipDetailView } from '@/features/payroll/ui/PayslipDetailView';
import { useState } from 'react';

// Simplified view for administrator to check generated payslips
export default function PayrollDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { payroll, isLoading: isPayrollLoading } = usePayrollDetail(id);
    const { payslips, isLoading: isPayslipsLoading } = usePayslips(id);

    const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);

    if (isPayrollLoading || isPayslipsLoading) return <div>Loading...</div>;
    if (!payroll) return <div>Payroll not found</div>;

    const selectedPayslip = payslips?.find(p => p.id === selectedPayslipId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold">{payroll.title}</h1>
                    <p className="text-gray-500">
                        귀속월: <span className="font-semibold text-gray-900">{payroll.targetMonth}</span> |
                        지급일: <span className="font-semibold text-gray-900">{payroll.paymentDate}</span> |
                        총 지급액: <span className="font-semibold text-gray-900">{payroll.totalAmount.toLocaleString()}원</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white border rounded-lg font-semibold text-sm flex items-center">
                        {payroll.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left: Employee List */}
                <div className="col-span-4 bg-white border rounded-lg overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                    <div className="p-4 border-b bg-gray-50 font-bold">
                        명세서 목록 ({payslips?.length || 0}명)
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {payslips?.map(payslip => (
                            <div
                                key={payslip.id}
                                onClick={() => setSelectedPayslipId(payslip.id)}
                                className={`p-3 rounded-lg cursor-pointer transition border
                            ${selectedPayslipId === payslip.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-200'}
                        `}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{payslip.userName}</span>
                                    <span className="text-sm text-gray-500">{payslip.departmentName}</span>
                                </div>
                                <div className="flex justify-between mt-1 text-sm">
                                    <span>실수령액</span>
                                    <span className="font-bold text-gray-700">{payslip.netAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Payslip Preview */}
                <div className="col-span-8 h-[calc(100vh-200px)] overflow-y-auto">
                    {selectedPayslip ? (
                        <PayslipDetailView payslip={{ ...selectedPayslip, payrollTitle: payroll.title, targetMonth: payroll.targetMonth }} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 border-2 border-dashed rounded-lg">
                            왼쪽 목록에서 직원을 선택하여 명세서를 확인하세요.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
