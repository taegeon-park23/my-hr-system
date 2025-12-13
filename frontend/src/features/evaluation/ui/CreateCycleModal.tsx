import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createEvaluationCycle } from "../api/evaluationApi";
import { CreateCycleRequest, EvaluationType } from "../model/types";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";
import { Select } from "@/shared/ui/Select";
import { APP_CONFIG } from "@/shared/config/constants";

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

    const evaluationTypeOptions = Object.values(EvaluationType).map((t) => ({
        label: t,
        value: t,
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="평가 회차 생성">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">제목</label>
                    <Input {...register("title", { required: true })} placeholder={`예: ${APP_CONFIG.CURRENT_YEAR} 상반기 정기평가`} />
                    {errors.title && <span className="text-red-500 text-xs">필수 입력입니다.</span>}
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">연도</label>
                        <Input type="number" {...register("year", { required: true })} defaultValue={APP_CONFIG.CURRENT_YEAR} />
                    </div>
                    <div className="flex-1">
                        <Select
                            label="유형"
                            options={evaluationTypeOptions}
                            {...register("type")}
                        />
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
        </Modal>
    );
}
