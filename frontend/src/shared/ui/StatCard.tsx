import React from 'react';

interface StatProps {
    label: string;
    value: string | number;
    color?: string;
    isLoading?: boolean;
}

export const StatCard = ({ label, value, color = "text-gray-900", isLoading = false }: StatProps) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                <dd className={`mt-1 text-3xl font-semibold ${color}`}>
                    {isLoading ? (
                        <div className="animate-pulse h-9 bg-gray-200 rounded w-24"></div>
                    ) : (
                        value
                    )}
                </dd>
            </div>
        </div>
    );
};
