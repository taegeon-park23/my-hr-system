"use client";

import { QuickStats } from '@/widgets/Dashboard/QuickStats';
import { QuickActions } from '@/widgets/Dashboard/QuickActions';

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-title)] mb-6">Dashboard</h1>
            <QuickStats />

            <h2 className="text-lg font-medium text-[var(--color-text-title)] mb-4">Quick Actions</h2>
            <QuickActions />
        </div>
    );
}
