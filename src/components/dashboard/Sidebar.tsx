"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
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

const navItems = [
    { label: "Command Center", href: "/dashboard", icon: FiGrid },
    { label: "Engagements", href: "/dashboard/engagements", icon: FiBriefcase },
    { label: "Communications", href: "/dashboard/communications", icon: FiMessageSquare },
    { label: "Finances", href: "/dashboard/finances", icon: FiDollarSign },
    { label: "Portfolio", href: "/dashboard/portfolio", icon: FiImage },
    { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
];

const bottomItems = [
    { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function DashboardSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuth();
    const { theme, setTheme } = useTheme();

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
                    <Image
                        src="/images/ig-profile.png"
                        alt="AB"
                        width={32}
                        height={32}
                        className="rounded-full bg-black flex-shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-sm font-bold text-[var(--text-primary)] tracking-tighter">
                            Brand Studio
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-muted)] transition-colors"
                >
                    <FiChevronLeft
                        size={16}
                        className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href)
                                ? "bg-orange/10 text-orange font-medium"
                                : "text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <item.icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="px-2 pb-4 space-y-1">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-primary)] transition-all w-full"
                >
                    {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                    {!collapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
                </button>

                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href)
                                ? "bg-orange/10 text-orange font-medium"
                                : "text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <item.icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}

                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all w-full"
                >
                    <FiLogOut size={18} className="flex-shrink-0" />
                    {!collapsed && <span>Sign out</span>}
                </button>

                {/* Back to Website */}
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-primary)] transition-all"
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
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-lil-black border border-gray-200 dark:border-gray-800 text-[var(--text-primary)]"
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
                className={`fixed top-0 left-0 h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 ${collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
                    } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
