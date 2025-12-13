import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { submitEvaluation } from "../api/evaluationApi";
import { Button } from "@/shared/ui/Button";

interface Props {
    recordId: number;
    initialScore?: number;
    initialComment?: string;
}

interface FormInputs {
    score: number;
    comment: string;
}

export function EvaluationForm({ recordId, initialScore = 0, initialComment = "" }: Props) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { score: initialScore, comment: initialComment }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: FormInputs) => {
        if (!confirm("제출하시겠습니까? 제출 후에는 수정할 수 없습니다.")) return;
        try {
            setIsSubmitting(true);
            await submitEvaluation(recordId, data);
            alert("평가가 제출되었습니다.");
            router.push("/evaluations/dashboard");
        } catch (error) {
            console.error(error);
            alert("제출 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">점수 (0 ~ 100)</label>
                <input
                    type="number"
                    step="0.1"
                    {...register("score", { required: true, min: 0, max: 100 })}
                    className="w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
                {errors.score && <p className="text-red-500 text-xs mt-1">0에서 100 사이의 점수를 입력하세요.</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">코멘트 (종합 의견)</label>
                <textarea
                    rows={5}
                    {...register("comment", { required: true })}
                    className="w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                    placeholder="성과 및 역량에 대한 구체적인 의견을 작성해주세요."
                />
                {errors.comment && <p className="text-red-500 text-xs mt-1">코멘트를 입력해주세요.</p>}
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => router.back()}>뒤로가기</Button>
                <Button type="submit" isLoading={isSubmitting}>제출하기</Button>
            </div>
        </form>
    );
}
