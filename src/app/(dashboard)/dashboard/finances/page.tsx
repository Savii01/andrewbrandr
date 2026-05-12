"use client";

import { motion } from "framer-motion";
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiDownload, FiCheckCircle, FiClock } from "react-icons/fi";
import { useActiveEngagements, useStudioStats } from "@/lib/hooks/useDashboardData";

export default function FinancesPage() {
    const { engagements, loading: engagementsLoading } = useActiveEngagements();
    const { stats, loading: statsLoading } = useStudioStats();

    // Mock recent transactions for visual completeness since we don't have a dedicated payments sub-collection yet
    const recentTransactions = engagements.slice(0, 5).map(eng => ({
        id: eng.id,
        client: eng.clientName,
        amount: eng.tier === "Enterprise" ? "Custom scoped" :
            eng.tier === "Scale" ? "₦900,000" :
                eng.tier === "Clarity" ? "₦300,000" : "₦80,000",
        date: eng.startDate ? new Date(eng.startDate).toLocaleDateString() : new Date().toLocaleDateString(),
        status: (eng as any).paymentStatus || "paid",
        type: "incoming"
    }));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Finances
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Track incoming payments, retainers, and studio revenue.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest rounded-xl hover:border-orange hover:text-orange transition-all">
                    <FiDownload size={16} />
                    Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                >
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-secondary)]">
                        <div className="p-2 bg-gray-50 dark:bg-lil-black rounded-lg">
                            <FiDollarSign size={18} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Total MRR</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
                                ₦{stats.monthlyRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs font-bold text-green flex items-center gap-1">
                                <FiArrowUpRight /> +12.5% from last month
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                >
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-secondary)]">
                        <div className="p-2 bg-gray-50 dark:bg-lil-black rounded-lg">
                            <FiClock size={18} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Pending Payments</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
                                {stats.unpaidInvoicesCount}
                            </p>
                            <p className="text-xs font-bold text-orange flex items-center gap-1">
                                ₦{stats.unpaidAmount.toLocaleString()} awaiting clearance
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl border border-orange/30 bg-orange text-white"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FiDollarSign size={18} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Projected Run Rate</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-white/20 rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold mb-2">
                                ₦{(stats.monthlyRevenue * 12).toLocaleString()}
                            </p>
                            <p className="text-xs font-medium text-white/80">
                                Estimated Annual Reccuring Revenue
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden"
            >
                <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-display text-[var(--text-primary)]">Recent Transactions</h2>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-orange hover:text-orange-light transition-colors">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-lil-black/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 lg:px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Client / Project</th>
                                <th className="px-6 lg:px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Date</th>
                                <th className="px-6 lg:px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Amount</th>
                                <th className="px-6 lg:px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {engagementsLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 lg:px-8 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" /></td>
                                        <td className="px-6 lg:px-8 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" /></td>
                                        <td className="px-6 lg:px-8 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" /></td>
                                        <td className="px-6 lg:px-8 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/3" /></td>
                                    </tr>
                                ))
                            ) : recentTransactions.length > 0 ? (
                                recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-lil-black/50 transition-colors">
                                        <td className="px-6 lg:px-8 py-4">
                                            <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{tx.client}</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Project Initiated</div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 text-sm text-[var(--text-secondary)] font-medium">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 text-sm font-bold text-[var(--text-primary)]">
                                            {tx.amount}
                                        </td>
                                        <td className="px-6 lg:px-8 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tx.status === 'paid' ? 'bg-green/10 text-green-500' : 'bg-orange/10 text-orange'
                                                }`}>
                                                {tx.status === 'paid' ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
