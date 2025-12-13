import type { Metadata } from "next";
import "./globals.css";
import { AuthListener } from "@/shared/providers/AuthListener";

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
                <AuthListener />
                {children}
            </body>
        </html>
    );
}

