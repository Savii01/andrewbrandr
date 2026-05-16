"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ProtectedRoute>
                    <div id="dashboard-root" className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
                        <DashboardSidebar />
                        <div className="lg:pl-[var(--sidebar-width)] transition-all duration-300">
                            <DashboardHeader />
                            <main className="min-h-screen p-6 md:p-8 lg:p-10 pt-24 lg:pt-32">
                                {children}
                            </main>
                        </div>
                    </div>
                </ProtectedRoute>
            </ThemeProvider>
        </AuthProvider>
    );
}
