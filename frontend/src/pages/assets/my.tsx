import React from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { useMyAssets } from "@/features/asset/api/assetApi";
import { MyAssetCard } from "@/features/asset/ui/MyAssetCard";

// Mock User ID (In real app, get from Context/Session)
const CURRENT_USER_ID = 2; // Samsung Admin or specific user

export default function MyAssetsPage() {
    const { assets, isLoading } = useMyAssets(CURRENT_USER_ID);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">내 자산 현황</h1>

                {isLoading ? (
                    <div>Loading...</div>
                ) : !assets || assets.length === 0 ? (
                    <div className="bg-white p-10 text-center rounded-lg border border-dashed border-gray-300 text-gray-500">
                        할당받은 자산이 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assets.map((asset) => (
                            <MyAssetCard key={asset.id} asset={asset} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
