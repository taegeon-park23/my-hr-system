import { Card } from '@/shared/ui/Card';
import { useAttendanceSummary } from '@/features/attendance/api/attendanceApi';

export const AttendanceChart = () => {
    const now = new Date();
    const { data: summary, isLoading } = useAttendanceSummary(now.getFullYear(), now.getMonth() + 1);

    const workedHours = summary?.totalHours || 0;
    const totalRequiredHours = 160; // Mock standard
    const progress = Math.min((workedHours / totalRequiredHours) * 100, 100);

    if (isLoading) return <div className="h-64 bg-slate-50 animate-pulse rounded-xl" />;

    return (
        <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">이번 달 근태 요약</h3>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-600">근무 달성률</span>
                    <span className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className="bg-primary-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-xs text-slate-400 text-right">
                    {workedHours}h / {totalRequiredHours}h
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-600 font-medium mb-1">지각</p>
                    <p className="text-xl font-bold text-orange-700">{summary?.lateCount || 0}회</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-600 font-medium mb-1">결근</p>
                    <p className="text-xl font-bold text-red-700">{summary?.absentCount || 0}회</p>
                </div>
            </div>
        </Card>
    );
};
