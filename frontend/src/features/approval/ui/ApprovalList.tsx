import React from 'react';
import Link from 'next/link';
import { ApprovalRequest } from '../model/types';

interface ApprovalListProps {
    requests: ApprovalRequest[];
    isLoading?: boolean;
}

export const ApprovalList = ({ requests, isLoading }: ApprovalListProps) => {
    if (isLoading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {requests.length === 0 ? (
                    <li className="p-6 text-center text-gray-500">No approval requests found.</li>
                ) : (
                    requests.map((request) => (
                        <li key={request.id}>
                            <Link href={`/dashboard/approval/${request.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{request.title}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {request.type}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Applied on {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
