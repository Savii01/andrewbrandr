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
    FiLayout,
    FiCalendar,
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
            { label: "Bookings", href: "/dashboard/bookings", icon: FiCalendar },
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
            { label: "Website CMS", href: "/dashboard/cms", icon: FiLayout },
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

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#5C1500] border border-[#FDF3E6]/25 text-[#FDF3E6] hover:bg-black/10 transition-all"
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
                className={`fixed top-0 left-0 h-full bg-[#5C1500] border-r border-[#FDF3E6]/10 z-40 transition-all duration-300 ${
                    collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
                } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full bg-[#5C1500] text-[#FDF3E6]">
                    {/* Logo / Notion-style Header */}
                    <div className="p-4 mb-2 flex items-center justify-between border-b border-[#FDF3E6]/10">
                        <Link href="/dashboard" className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors w-full group">
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/10 border border-[#FDF3E6]/25">
                                <Image
                                    src="/brand_assets/icon_logo_white_svg.svg"
                                    alt="Logo"
                                    width={18}
                                    height={18}
                                />
                            </div>
                            {!collapsed && (
                                <div className="text-left leading-none flex-1 truncate">
                                    <p className="text-xs font-black text-white group-hover:text-orange transition-colors">
                                        AndrewBrandr Studio
                                    </p>
                                    <p className="text-[9px] font-bold text-[#FDF3E6]/60 mt-0.5 uppercase tracking-wider">
                                        Saviour Andrew's Workspace
                                    </p>
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-1 rounded-md hover:bg-white/5 text-[#FDF3E6]/60 hover:text-white transition-colors ml-2"
                        >
                            <FiChevronLeft
                                size={16}
                                className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    {/* Notion Top Quick Controls */}
                    {!collapsed && (
                        <div className="px-4 py-2 grid grid-cols-4 gap-1.5 border-b border-[#FDF3E6]/10 mb-4">
                            <Link href="/dashboard" className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-colors" title="Home">
                                <FiGrid size={16} />
                            </Link>
                            <Link href="/dashboard/settings" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FDF3E6]/80 hover:text-white flex items-center justify-center transition-colors" title="Settings">
                                <FiSettings size={16} />
                            </Link>
                            <Link href="/dashboard/communications" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FDF3E6]/80 hover:text-white flex items-center justify-center transition-colors" title="Messages">
                                <FiMessageSquare size={16} />
                            </Link>
                            <button onClick={handleSignOut} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#FDF3E6]/80 hover:text-red-300 flex items-center justify-center transition-colors" title="Sign Out">
                                <FiLogOut size={16} />
                            </button>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-6 overflow-y-auto no-scrollbar pb-8">
                        {navGroups.map((group) => (
                            <div key={group.title} className="space-y-1">
                                {!collapsed && (
                                    <h3 className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#FDF3E6]/50 mb-2">
                                        {group.title}
                                    </h3>
                                )}
                                <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                                                isActive(item.href)
                                                    ? "bg-white/15 text-white font-extrabold shadow-sm shadow-black/5 border border-white/10"
                                                    : "text-[#FDF3E6]/70 hover:bg-white/5 hover:text-white font-medium"
                                            }`}
                                        >
                                            <item.icon size={16} className={`flex-shrink-0 ${isActive(item.href) ? "text-orange" : "opacity-80"}`} />
                                            {!collapsed && <span>{item.label}</span>}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Actions Block */}
                    <div className="p-4 border-t border-[#FDF3E6]/10 space-y-2">
                        {!collapsed && (
                            <button 
                                data-testid="new-engagement-btn"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent("open-new-engagement-modal"));
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#5C1500] text-xs font-black hover:bg-orange hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                                <span>+ Onboard Client</span>
                            </button>
                        )}

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-[#FDF3E6]/60 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <FiChevronLeft size={14} className="flex-shrink-0" />
                            {!collapsed && <span>Back to public site</span>}
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
