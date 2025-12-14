import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InterceptorInitializer } from "@/shared/api/InterceptorInitializer";
import { Providers } from "./providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

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
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <body className="antialiased">
                <Providers>
                    <InterceptorInitializer />
                    {children}
                </Providers>
            </body>
        </html>
    );
}



