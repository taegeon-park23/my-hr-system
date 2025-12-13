import React, { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { CycleManagementTable } from "@/features/evaluation/ui/CycleManagementTable";
import { CreateCycleModal } from "@/features/evaluation/ui/CreateCycleModal";
import { Button } from "@/shared/ui/Button";

const COMPANY_ID = 2; // Mock Company ID

export default function CycleManagePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">평가 회차 관리</h1>
                    <Button onClick={() => setIsModalOpen(true)}>+ 회차 생성</Button>
                </div>

                <CycleManagementTable key={refreshKey} companyId={COMPANY_ID} />

                <CreateCycleModal
                    companyId={COMPANY_ID}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => setRefreshKey((p) => p + 1)}
                />
            </div>
        </DashboardLayout>
    );
}
