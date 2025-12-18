'use client';

import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/shared/ui/Icon';

const ActionButton = ({ href, label, icon }: { href: string; label: string; icon: IconName }) => (
    <Link href={href} className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:bg-secondary-50 transition">
        <div>
            <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white group-hover:bg-primary-100">
                <Icon name={icon} className="h-6 w-6" />
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
            <Icon name="ArrowUpRightIcon" className="h-6 w-6" />
        </span>
    </Link>
);

export const QuickActions = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ActionButton
                href="/dashboard/vacation/request"
                label="Request Vacation"
                icon="CalendarDaysIcon"
            />
            <ActionButton
                href="/dashboard/approval"
                label="Process Approvals"
                icon="ClipboardDocumentCheckIcon"
            />
            <ActionButton
                href="/dashboard/settings"
                label="Update Profile"
                icon="UserIcon"
            />
            <ActionButton
                href="/dashboard/payroll"
                label="View Payslips"
                icon="CurrencyDollarIcon"
            />
        </div>
    );
};

