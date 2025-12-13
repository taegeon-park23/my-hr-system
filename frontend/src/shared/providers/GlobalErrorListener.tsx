"use client";

import { useEffect } from "react";
import { useToast } from "@/shared/ui/Toast";

export function GlobalErrorListener() {
    const { showToast } = useToast();

    useEffect(() => {
        const handleApiError = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string }>;
            showToast(customEvent.detail.message, 'error');
        };

        const handleUnauthorized = () => {
            showToast("Session expired. Please login again.", 'warning');
        };

        window.addEventListener("api:error", handleApiError);
        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("api:error", handleApiError);
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, [showToast]);

    return null;
}
