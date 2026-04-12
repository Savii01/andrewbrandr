"use client";

import { AuthProvider } from "@/lib/auth-context";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-black">
                <DashboardSidebar />
                <div className="lg:pl-[var(--sidebar-width)] transition-all duration-300">
                    <DashboardHeader />
                    <main className="min-h-screen p-6 md:p-8 lg:p-10 pt-[calc(var(--header-height)+24px)] lg:pt-[calc(var(--header-height)+24px)]">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
