import React from "react";
import { Asset } from "../api/assetApi";

interface Props {
    asset: Asset;
}

export function MyAssetCard({ asset }: Props) {
    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded mb-2">
                        {asset.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{asset.modelName}</h3>
                    <p className="text-sm text-gray-500">S/N: {asset.serialNumber || "N/A"}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400">지급일</span>
                    <p className="text-sm text-gray-700">{asset.updatedAt.split("T")[0]}</p>
                </div>
            </div>

            {asset.note && (
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                    {asset.note}
                </div>
            )}
        </div>
    );
}
