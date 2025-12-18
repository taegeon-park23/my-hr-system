import { QuickStats } from '@/widgets/Dashboard/QuickStats';
import { QuickActions } from '@/widgets/Dashboard/QuickActions';
import { ManagerStats } from '@/widgets/Dashboard/ManagerStats';
import { DepartmentHeadcount } from '@/widgets/Dashboard/DepartmentHeadcount';

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-6 font-display">Dashboard</h1>
                <QuickStats />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ManagerStats />
                </div>
                <div>
                    <DepartmentHeadcount />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium text-slate-900 mb-4 font-display">Quick Actions</h2>
                <QuickActions />
            </div>
        </div>
    );
}
