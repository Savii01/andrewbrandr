"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/hooks/useDashboardData";
import { FiBell, FiSearch, FiUser, FiFileText, FiCalendar, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHeader() {
    const { user } = useAuth();
    const { notifications, unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [now] = useState(() => Date.now());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const formatTimeAgo = (date: Date) => {
        const diff = now - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <header className="h-[var(--header-height)] fixed top-0 right-0 left-0 lg:left-[var(--sidebar-width)] z-30 flex items-center justify-between px-6 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-color)] transition-all">
            {/* Search / Breadcrumbs Area */}
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search command center..."
                        className="pl-10 pr-4 py-2 bg-[var(--surface)] border-none rounded-full text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-orange w-64 transition-all"
                    />
                </div>
            </div>

            {/* Actions area */}
            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors relative"
                        aria-label="Notifications"
                    >
                        <FiBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-orange text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[var(--background)]">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
                                        <h3 className="text-sm font-black text-[var(--text-primary)]">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange/10 text-orange">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-[380px] overflow-y-auto no-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <Link
                                                    key={n.id}
                                                    href={n.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-start gap-3 px-5 py-3.5 border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--surface)] transition-colors group"
                                                >
                                                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                                                        n.type === "brief"
                                                            ? "bg-orange/10 text-orange"
                                                            : "bg-green/10 text-green"
                                                    }`}>
                                                        {n.type === "brief" ? <FiFileText size={14} /> : <FiCalendar size={14} />}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5 line-clamp-2">
                                                            {n.subtitle}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-orange mt-1 flex items-center gap-1">
                                                            View <FiExternalLink size={9} />
                                                            <span className="text-[var(--text-muted)] font-medium ml-1">
                                                                · {formatTimeAgo(n.date)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="px-5 py-12 text-center">
                                                <div className="w-10 h-10 rounded-full bg-[var(--surface)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-3">
                                                    <FiBell size={16} />
                                                </div>
                                                <p className="text-xs font-bold text-[var(--text-primary)]">All caught up</p>
                                                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                                                    New briefs and bookings will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-[1px] bg-[var(--border-color)] mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-orange transition-colors">
                            {user?.displayName || "Studio Admin"}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                            Admin Access
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt="User" width={32} height={32} />
                        ) : (
                            <FiUser size={16} className="text-[var(--text-secondary)]" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
