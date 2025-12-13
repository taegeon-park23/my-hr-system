import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateCycleRequest, EvaluationType, createEvaluationCycle } from "../api/evaluationApi";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

interface Props {
    companyId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateCycleModal({ companyId, isOpen, onClose, onSuccess }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCycleRequest>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: CreateCycleRequest) => {
        try {
            setLoading(true);
            await createEvaluationCycle({ ...data, companyId });
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create cycle", error);
            alert("회차 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">평가 회차 생성</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">제목</label>
                        <Input {...register("title", { required: true })} placeholder="예: 2025 상반기 정기평가" />
                        {errors.title && <span className="text-red-500 text-xs">필수 입력입니다.</span>}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">연도</label>
                            <Input type="number" {...register("year", { required: true })} defaultValue={new Date().getFullYear()} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">유형</label>
                            <select {...register("type")} className="w-full border rounded p-2">
                                {Object.values(EvaluationType).map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">시작일</label>
                            <Input type="date" {...register("startDate", { required: true })} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">마감일</label>
                            <Input type="date" {...register("endDate", { required: true })} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
                        <Button type="submit" isLoading={loading}>생성</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
