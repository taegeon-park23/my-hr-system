import React, { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { AssetListTable } from "@/features/asset/ui/AssetListTable";
import { AssetCreateModal } from "@/features/asset/ui/AssetCreateModal";
import { Button } from "@/shared/ui/Button";

// Mock Tenant ID (In real app, get from Context/Session)
const COMPANY_ID = 2; // Samsung Electronics

export default function AssetManagePage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Trigger table refresh

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">자산 관리</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>+ 자산 등록</Button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    {/* We pass key to force re-render if needed, but SWR handles it mostly */}
                    <AssetListTable key={refreshKey} companyId={COMPANY_ID} />
                </div>

                <AssetCreateModal
                    companyId={COMPANY_ID}
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => setRefreshKey(prev => prev + 1)}
                />
            </div>
        </DashboardLayout>
    );
}
