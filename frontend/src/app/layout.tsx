import type { Metadata } from "next";
import "./globals.css";
import { InterceptorInitializer } from "@/shared/api/InterceptorInitializer";
import { Providers } from "./providers";

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
                <Providers>
                    <InterceptorInitializer />
                    {children}
                </Providers>
            </body>
        </html>
    );
}



