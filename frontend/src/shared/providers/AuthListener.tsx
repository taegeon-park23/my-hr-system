"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { ROUTES } from "@/shared/config/constants";

export function AuthListener() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
            router.push(ROUTES.LOGIN);
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, [logout, router]);

    return null;
}
