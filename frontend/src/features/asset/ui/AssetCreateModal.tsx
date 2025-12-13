import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AssetCategory, CreateAssetRequest, createAsset } from "../api/assetApi";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

interface Props {
    companyId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssetCreateModal({ companyId, isOpen, onClose, onSuccess }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAssetRequest>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: CreateAssetRequest) => {
        try {
            setLoading(true);
            await createAsset({ ...data, companyId });
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create asset", error);
            alert("자산 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">자산 등록</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">모델명</label>
                        <Input {...register("modelName", { required: true })} placeholder="예: MacBook Pro 14" />
                        {errors.modelName && <span className="text-red-500 text-xs">필수 입력입니다.</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">카테고리</label>
                        <select
                            {...register("category", { required: true })}
                            className="w-full border rounded p-2"
                        >
                            {Object.values(AssetCategory).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">시리얼 번호</label>
                        <Input {...register("serialNumber")} placeholder="Optional" />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">구매일</label>
                            <Input type="date" {...register("purchaseDate")} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">구매가</label>
                            <Input type="number" {...register("purchasePrice")} placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">비고</label>
                        <textarea
                            {...register("note")}
                            className="w-full border rounded p-2"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
                        <Button type="submit" isLoading={loading}>등록</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
