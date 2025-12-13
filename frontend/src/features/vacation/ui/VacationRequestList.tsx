import React from 'react';
import { VacationRequest } from '../model/types';

interface Props {
    requests: VacationRequest[];
    isLoading: boolean;
}

export const VacationRequestList: React.FC<Props> = ({ requests, isLoading }) => {
    if (isLoading) {
        return <div className="p-6 bg-white rounded-lg shadow animate-pulse">Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">휴가 종류</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">일수</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {req.vacationType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {req.startDate} ~ {req.endDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {req.requestDays}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {req.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                신청 내역이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
