"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    FiGrid,
    FiBriefcase,
    FiMessageSquare,
    FiDollarSign,
    FiImage,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiSun,
    FiMoon,
    FiChevronLeft,
} from "react-icons/fi";

const navGroups = [
    {
        title: "Overview",
        items: [
            { label: "Command Center", href: "/dashboard", icon: FiGrid },
        ]
    },
    {
        title: "Commercial",
        items: [
            { label: "Engagements", href: "/dashboard/engagements", icon: FiBriefcase },
            { label: "Briefs (Inbox)", href: "/dashboard/briefs", icon: FiMessageSquare },
            { label: "Finances", href: "/dashboard/finances", icon: FiDollarSign },
        ]
    },
    {
        title: "Creative",
        items: [
            { label: "Portfolio", href: "/dashboard/portfolio", icon: FiImage },
            { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
        ]
    },
    {
        title: "System",
        items: [
            { label: "Communications", href: "/dashboard/communications", icon: FiMessageSquare },
            { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
        ]
    }
];

export default function DashboardSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 mb-2">
                <Link href="/dashboard" className="flex items-center gap-2">
                    {collapsed ? (
                        <Image
                            src="/brand_assets/icon_logo_black_svg.svg"
                            alt="Brandr Icon"
                            width={28}
                            height={28}
                            className="flex-shrink-0"
                        />
                    ) : (
                        <Image
                            src="/brand_assets/secondary_logo_black_svg.svg"
                            alt="Brandr"
                            width={110}
                            height={24}
                            className="flex-shrink-0 w-auto h-6"
                        />
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1 rounded-md hover:bg-[var(--surface)] text-[var(--text-muted)] transition-colors"
                >
                    <FiChevronLeft
                        size={16}
                        className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-6 overflow-y-auto no-scrollbar pb-8">
                {navGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!collapsed && (
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href)
                                        ? "bg-orange/10 text-orange font-medium"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <item.icon size={18} className="flex-shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                        {collapsed && group.title !== "Overview" && (
                             <div className="h-[1px] bg-[var(--border-color)] mx-3 my-4 opacity-50" />
                        )}
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="px-2 pb-4 space-y-1 border-t border-[var(--border-color)] pt-4">
                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
                >
                    <FiLogOut size={18} className="flex-shrink-0" />
                    {!collapsed && <span>Sign out</span>}
                </button>

                {/* Back to Website */}
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-all"
                >
                    <FiChevronLeft size={14} className="flex-shrink-0" />
                    {!collapsed && <span>Back to website</span>}
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)]"
            >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-[var(--background)] border-r border-[var(--border-color)] z-40 transition-all duration-300 ${collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
                    } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
