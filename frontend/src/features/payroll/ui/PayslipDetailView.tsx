import { Payslip } from '../model/types';

interface Props {
    payslip: Payslip;
}

export function PayslipDetailView({ payslip }: Props) {
    return (
        <div className="bg-white p-8 border rounded-lg shadow-sm max-w-3xl mx-auto print:shadow-none print:border-none">

            {/* Header */}
            <div className="text-center mb-8 pb-4 border-b-2 border-gray-800">
                <h1 className="text-2xl font-bold">급여 명세서 (Payslip)</h1>
                <p className="text-gray-600 mt-2">{payslip.payrollTitle} ({payslip.targetMonth})</p>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex">
                    <span className="w-24 font-bold text-gray-700">성명:</span>
                    <span>{payslip.userName}</span>
                </div>
                <div className="flex">
                    <span className="w-24 font-bold text-gray-700">부서:</span>
                    <span>{payslip.departmentName}</span>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* 지급 내역 */}
                <div>
                    <h3 className="font-bold border-b border-gray-400 mb-2 pb-1">지급 내역</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>기본급</span>
                            <span>{payslip.baseSalary.toLocaleString()}</span>
                        </div>
                        {payslip.items.filter(i => i.itemType === 'ALLOWANCE').map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <span>{item.itemName}</span>
                                <span>{item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                        <span>지급 총액</span>
                        <span>{(payslip.baseSalary + payslip.totalAllowance).toLocaleString()}</span>
                    </div>
                </div>

                {/* 공제 내역 */}
                <div>
                    <h3 className="font-bold border-b border-gray-400 mb-2 pb-1">공제 내역</h3>
                    <div className="space-y-2">
                        {payslip.items.filter(i => i.itemType === 'DEDUCTION').map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <span>{item.itemName}</span>
                                <span>{item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                        <span>공제 총액</span>
                        <span>{payslip.totalDeduction.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Net Amount */}
            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span className="text-lg font-bold">실 수령액 (차인지급액)</span>
                <span className="text-2xl font-bold text-blue-600">{payslip.netAmount.toLocaleString()} 원</span>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>귀하의 노고에 진심으로 감사드립니다.</p>
                <p className="mt-1">주식회사 앤티그래비티</p>
            </div>
        </div>
    );
}
