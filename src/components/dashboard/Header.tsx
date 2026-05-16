"use client";

import { useAuth } from "@/lib/auth-context";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import Image from "next/image";

export default function DashboardHeader() {
    const { user } = useAuth();

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
                <button className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors relative">
                    <FiBell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange rounded-full border-2 border-[var(--background)]"></span>
                </button>

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
