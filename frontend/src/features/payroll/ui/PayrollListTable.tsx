import { Payroll } from '../model/types';

interface Props {
    data: Payroll[];
    onViewDetail: (id: number) => void;
}

export function PayrollListTable({ data, onViewDetail }: Props) {
    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">귀속월</th>
                        <th scope="col" className="px-6 py-3">제목</th>
                        <th scope="col" className="px-6 py-3">지급일</th>
                        <th scope="col" className="px-6 py-3">총 지급액</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                        <th scope="col" className="px-6 py-3">관리</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((payroll) => (
                        <tr key={payroll.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{payroll.targetMonth}</td>
                            <td className="px-6 py-4">{payroll.title}</td>
                            <td className="px-6 py-4">{payroll.paymentDate}</td>
                            <td className="px-6 py-4">{payroll.totalAmount.toLocaleString()}원</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${payroll.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                        payroll.status === 'PAID' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {payroll.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onViewDetail(payroll.id)}
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">데이터가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
