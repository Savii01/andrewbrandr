"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import NewEngagementModal from "@/components/dashboard/NewEngagementModal";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isEngagementModalOpen, setIsEngagementModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenModal = () => setIsEngagementModalOpen(true);
        window.addEventListener("open-new-engagement-modal", handleOpenModal);
        return () => window.removeEventListener("open-new-engagement-modal", handleOpenModal);
    }, []);

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
                        <NewEngagementModal
                            isOpen={isEngagementModalOpen}
                            onClose={() => setIsEngagementModalOpen(false)}
                        />
                    </div>
                </ProtectedRoute>
            </ThemeProvider>
        </AuthProvider>
    );
}
