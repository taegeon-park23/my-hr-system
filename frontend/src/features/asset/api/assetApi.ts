import useSWR from "swr";
import { client } from "@/shared/api/client";
import { fetcher } from "@/shared/api/fetcher";
import { queryKeys } from "@/shared/api/queryKeys";

export enum AssetCategory {
    LAPTOP = "LAPTOP",
    DESKTOP = "DESKTOP",
    MONITOR = "MONITOR",
    ACCESSORY = "ACCESSORY",
    SOFTWARE = "SOFTWARE",
    FURNITURE = "FURNITURE",
    OTHER = "OTHER",
}

export enum AssetStatus {
    AVAILABLE = "AVAILABLE",
    ASSIGNED = "ASSIGNED",
    BROKEN = "BROKEN",
    REPAIRING = "REPAIRING",
    DISCARDED = "DISCARDED",
}

export interface Asset {
    id: number;
    companyId: number;
    currentUserId: number | null;
    category: AssetCategory;
    modelName: string;
    serialNumber: string | null;
    purchaseDate: string | null;
    purchasePrice: number;
    status: AssetStatus;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAssetRequest {
    companyId: number;
    category: AssetCategory;
    modelName: string;
    serialNumber?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    note?: string;
}

export function useAdminAssets(companyId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<Asset[]>(
        companyId ? queryKeys.asset.list(companyId) : null,
        fetcher
    );

    return {
        assets: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useMyAssets(userId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<Asset[]>(
        userId ? queryKeys.asset.my(userId) : null,
        fetcher
    );

    return {
        assets: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export async function createAsset(data: CreateAssetRequest) {
    const response = await client.post(`/admin/assets`, data);
    return response.data;
}

export async function assignAsset(assetId: number, userId: number) {
    const response = await client.post(`/admin/assets/${assetId}/assign`, {
        userId,
    });
    return response.data;
}

export async function returnAsset(assetId: number) {
    const response = await client.post(`/admin/assets/${assetId}/return`);
    return response.data;
}

export async function updateAssetStatus(assetId: number, status: AssetStatus) {
    const response = await client.patch(`/admin/assets/${assetId}/status`, {
        status,
    });
    return response.data;
}
