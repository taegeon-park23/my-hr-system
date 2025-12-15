import "@/app/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        useAuthStore.persist.rehydrate();
    }, []);

    return <Component {...pageProps} />;
}
