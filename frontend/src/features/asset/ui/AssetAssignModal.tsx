import React, { useState } from "react";
import { assignAsset } from "../api/assetApi";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

interface Props {
    assetId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssetAssignModal({ assetId, isOpen, onClose, onSuccess }: Props) {
    const [userIdInput, setUserIdInput] = useState("");
    const [loading, setLoading] = useState(false);

    // In a real app, this would be a user search component (AsyncSelect).
    // For MVP, we'll input User ID directly.

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assetId || !userIdInput) return;

        try {
            setLoading(true);
            await assignAsset(assetId, Number(userIdInput));
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to assign asset", error);
            alert("할당에 실패했습니다. 유효한 User ID인지 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="자산 할당" maxWidth="sm">
            <form onSubmit={onSubmit} className="space-y-4">
                <p className="text-gray-600 text-sm">
                    할당할 사용자의 ID를 입력하세요. (임시)
                </p>
                <div>
                    <label className="block text-sm font-medium mb-1">User ID</label>
                    <Input
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="Enter User ID"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
                    <Button type="submit" isLoading={loading}>할당</Button>
                </div>
            </form>
        </Modal>
    );
}

