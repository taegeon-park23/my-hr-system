import type { Metadata } from "next";
import "./globals.css";
import { InterceptorInitializer } from "@/shared/api/InterceptorInitializer";
import { ToastProvider } from "@/shared/ui/Toast";

export const metadata: Metadata = {
    title: "HR System",
    description: "Next-Gen HR SaaS System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ToastProvider>
                    <InterceptorInitializer />
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}



