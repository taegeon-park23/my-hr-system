import type { Metadata } from "next";
import "./globals.css";
import { AuthListener } from "@/shared/providers/AuthListener";
import { ToastProvider } from "@/shared/ui/Toast";
import { GlobalErrorListener } from "@/shared/providers/GlobalErrorListener";

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
                    <AuthListener />
                    <GlobalErrorListener />
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}



