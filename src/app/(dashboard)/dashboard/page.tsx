"use client";

import { motion } from "framer-motion";
import {
    FiBriefcase,
    FiDollarSign,
    FiAlertCircle,
    FiMessageSquare,
    FiBarChart2,
    FiChevronRight,
} from "react-icons/fi";
import { useActiveEngagements, useStudioStats } from "@/lib/hooks/useDashboardData";
import { useState } from "react";
import NewEngagementModal from "@/components/dashboard/NewEngagementModal";
import { FiPlus } from "react-icons/fi";

function StatCard({
    icon: Icon,
    label,
    value,
    subtext,
    accent = false,
    delay = 0,
    loading = false
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subtext?: string;
    accent?: boolean;
    delay?: number;
    loading?: boolean;
}) {
    if (loading) {
        return (
            <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-lil-black animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-1/3" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5 transition-all group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${accent ? 'bg-orange/10 text-orange' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)]'}`}>
                    <Icon size={20} />
                </div>
                {subtext && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{subtext}</span>
                )}
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)] mb-1 tracking-tighter">{value}</p>
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{label}</p>
        </motion.div>
    );
}

function PhaseBar({ phase, progress }: { phase: string; progress: number }) {
    const phaseColors: Record<string, string> = {
        Strategy: "bg-blue-500",
        Design: "bg-orange",
        Systems: "bg-purple-500",
        Execution: "bg-green",
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{phase}</span>
                    <span className="text-[10px] font-bold text-orange">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full transition-all ${phaseColors[phase] || "bg-orange"}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CommandCenter() {
    const { engagements, loading: loadingEngagements } = useActiveEngagements();
    const { stats, loading: loadingStats } = useStudioStats();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto">
            <NewEngagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <h1 className="text-[24px] md:text-[36px] lg:text-[40px] font-display text-[var(--text-primary)] mb-2">
                        Good morning, <span className="text-orange">Director</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Everything is running at <span className="text-green font-bold">peak efficiency</span> today.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-orange text-white text-xs font-bold uppercase tracking-[0.1em] rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10 self-start md:self-auto"
                >
                    <FiPlus size={18} />
                    New Project
                </button>
            </motion.div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                <StatCard
                    icon={FiBriefcase}
                    label="Active Engagements"
                    value={stats.activeEngagementsCount}
                    loading={loadingStats}
                    accent
                />
                <StatCard
                    icon={FiDollarSign}
                    label="Monthly Revenue"
                    value={`₦${stats.monthlyRevenue.toLocaleString()}`}
                    loading={loadingStats}
                    delay={0.1}
                />
                <StatCard
                    icon={FiAlertCircle}
                    label="Unpaid Invoices"
                    value={stats.unpaidInvoicesCount}
                    subtext={`₦${stats.unpaidAmount.toLocaleString()}`}
                    loading={loadingStats}
                    delay={0.2}
                />
                <StatCard
                    icon={FiMessageSquare}
                    label="Urgent Alerts"
                    value={stats.urgentAlertsCount}
                    loading={loadingStats}
                    accent
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Active Engagements List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-display text-[var(--text-primary)]">
                            Active Studio Engagements
                        </h2>
                        <button className="text-[10px] uppercase tracking-widest font-bold text-orange hover:text-orange-light transition-colors">
                            Manage All
                        </button>
                    </div>

                    <div className="space-y-6">
                        {loadingEngagements ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
                                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                                </div>
                            ))
                        ) : engagements.length > 0 ? (
                            engagements.map((eng) => (
                                <div key={eng.id} className="group cursor-pointer">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-lil-black flex items-center justify-center text-orange border border-gray-100 dark:border-gray-800 group-hover:bg-orange group-hover:text-white transition-all">
                                                <FiBriefcase size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--text-primary)] text-sm">{eng.clientName}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">{eng.tier} Tier</p>
                                            </div>
                                        </div>
                                        <FiChevronRight className="text-[var(--text-muted)] group-hover:text-orange group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <PhaseBar phase={eng.phase} progress={eng.progress} />
                                    <div className="h-[1px] w-full bg-gray-50 dark:bg-gray-900 mt-6" />
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-[var(--text-muted)] text-sm">No active engagements at the moment.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Side Panels */}
                <div className="space-y-8">
                    {/* Recent Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">
                            Recent Stream
                        </h3>
                        <div className="space-y-6">
                            {[
                                { status: "success", text: "Studio setup finalized successfully", time: "Just now" },
                                { status: "pending", text: "Database connection established", time: "10m ago" },
                                { status: "urgent", text: "System ready for client onboarding", time: "Today" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-green' :
                                            item.status === 'urgent' ? 'bg-orange' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">{item.text}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-tighter">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Analytics Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-orange p-8 text-white relative overflow-hidden"
                    >
                        <FiBarChart2 className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 relative z-10">
                            Volume YTD
                        </h3>
                        <p className="text-4xl font-bold tracking-tighter relative z-10 mb-2">
                            ₦{(stats.monthlyRevenue * 12).toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-white/80 relative z-10">
                            Estimated volume based on current run-rate
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
