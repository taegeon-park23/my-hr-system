import useSWR from "swr";
import { client } from "@/shared/api/client";

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

const fetcher = (url: string) => client.get(url).then((res) => res.data);

export function useAdminAssets(companyId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<Asset[]>(
        companyId ? `/admin/assets?companyId=${companyId}` : null,
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
        userId ? `/assets/my?userId=${userId}` : null,
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
