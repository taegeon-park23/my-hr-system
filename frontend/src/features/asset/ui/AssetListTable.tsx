import React, { useState } from "react";
import { Asset, AssetStatus, useAdminAssets, returnAsset } from "../api/assetApi";
import { Button } from "@/shared/ui/Button";
import { AssetAssignModal } from "./AssetAssignModal";

interface Props {
    companyId: number;
}

export function AssetListTable({ companyId }: Props) {
    const { assets, isLoading, mutate } = useAdminAssets(companyId);
    const [assignModal, setAssignModal] = useState<{ isOpen: boolean; assetId: number | null }>({
        isOpen: false,
        assetId: null,
    });

    const handleReturn = async (id: number) => {
        if (!confirm("정말 회수하시겠습니까? (상태가 AVAILABLE로 변경됨)")) return;
        try {
            await returnAsset(id);
            mutate();
        } catch (error) {
            alert("회수 처리에 실패했습니다.");
        }
    };

    if (isLoading) return <div>Loading assets...</div>;
    if (!assets || assets.length === 0) return <div className="p-4 text-gray-500">등록된 자산이 없습니다.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">모델명</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시리얼 #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {assets.map((asset) => (
                        <tr key={asset.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{asset.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.modelName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serialNumber || "-"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${asset.status === AssetStatus.AVAILABLE ? "bg-green-100 text-green-800" :
                                        asset.status === AssetStatus.ASSIGNED ? "bg-blue-100 text-blue-800" :
                                            "bg-red-100 text-red-800"}`}>
                                    {asset.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {asset.currentUserId ? `User #${asset.currentUserId}` : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {asset.status === AssetStatus.AVAILABLE && (
                                    <Button size="sm" onClick={() => setAssignModal({ isOpen: true, assetId: asset.id })}>할당</Button>
                                )}
                                {asset.status === AssetStatus.ASSIGNED && (
                                    <Button size="sm" variant="secondary" onClick={() => handleReturn(asset.id)}>회수</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AssetAssignModal
                isOpen={assignModal.isOpen}
                assetId={assignModal.assetId}
                onClose={() => setAssignModal({ ...assignModal, isOpen: false })}
                onSuccess={() => mutate()}
            />
        </div>
    );
}
