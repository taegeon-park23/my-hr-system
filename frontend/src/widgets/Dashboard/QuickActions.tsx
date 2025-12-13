import Link from 'next/link';
import React from 'react';

const ActionButton = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
    <Link href={href} className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:bg-gray-50 transition">
        <div>
            <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white group-hover:bg-indigo-100">
                {icon}
            </span>
        </div>
        <div className="mt-8">
            <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                {label}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
                Click to proceed
            </p>
        </div>
        <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0 1 1 0 00-2 0zm-9-8a1 1 0 00-1 1v1h1V8zm1 1a1 1 0 001-1h-1v1zm-5 4a1 1 0 00-1 1v1h1v-1zm1 1a1 1 0 001-1h-1v1zm8-9a1 1 0 00-1 1v1h1V4zm1 1a1 1 0 001-1h-1v1zm-9 8a1 1 0 00-1 1v1h1v-1zm1 1a1 1 0 001-1h-1v1z" />
            </svg>
        </span>
    </Link>
);

export const QuickActions = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ActionButton
                href="/dashboard/vacation/request"
                label="Request Vacation"
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                }
            />
            <ActionButton
                href="/dashboard/approval"
                label="Process Approvals"
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
            <ActionButton
                href="/dashboard/settings"
                label="Update Profile"
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
            />
            <ActionButton
                href="/dashboard/payroll"
                label="View Payslips"
                icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
        </div>
    );
};
