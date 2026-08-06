"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiActivity, FiPieChart, FiUsers, FiDollarSign } from "react-icons/fi";
import { useStudioStats, useActiveEngagements } from "@/lib/hooks/useDashboardData";

function MetricCard({ title, value, change, icon: Icon, delay = 0 }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)]"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-orange/10 text-orange">
                    <Icon size={20} />
                </div>
                {change && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change > 0 ? 'bg-green/10 text-green' : 'bg-red-500/10 text-red-500'}`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <p className="text-sm font-bold text-[var(--text-muted)] mb-1">{title}</p>
            <p className="text-3xl font-display font-bold text-[var(--text-primary)] tracking-tighter">{value}</p>
        </motion.div>
    );
}

export default function AnalyticsPage() {
    const { stats, loading: statsLoading } = useStudioStats();
    const { engagements } = useActiveEngagements();

    // Calculate phase distribution
    const phaseCounts = engagements.reduce((acc: any, eng) => {
        const stage = eng.stagePrimary;
        let phase = "Strategy";
        if (stage === "discovery" || stage === "proposal") phase = "Strategy";
        else if (stage === "strategy" || stage === "creativeDirection") phase = "Design";
        else if (stage === "identity" || stage === "presentation") phase = "Systems";
        else phase = "Execution";

        acc[phase] = (acc[phase] || 0) + 1;
        return acc;
    }, {});

    const phases = ["Strategy", "Design", "Systems", "Execution"];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                    Studio Intelligence
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Real-time performance metrics and business growth indicators
                </p>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard 
                    title="Monthly Revenue" 
                    value={`₦${stats.monthlyRevenue.toLocaleString()}`} 
                    change={12.5} 
                    icon={FiDollarSign} 
                />
                <MetricCard 
                    title="Active Rooms" 
                    value={stats.activeEngagementsCount} 
                    change={5} 
                    icon={FiActivity} 
                    delay={0.1}
                />
                <MetricCard 
                    title="Avg Project Value" 
                    value={`₦${Math.round(stats.monthlyRevenue / (stats.activeEngagementsCount || 1)).toLocaleString()}`} 
                    icon={FiTrendingUp} 
                    delay={0.2}
                />
                <MetricCard 
                    title="Total Clients" 
                    value={stats.activeEngagementsCount + 12} // Mocking total for now
                    icon={FiUsers} 
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Phase Distribution Chart (Custom CSS) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)]"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Phase Distribution</h3>
                            <p className="text-xs text-[var(--text-muted)]">Where are your projects currently sitting?</p>
                        </div>
                        <FiPieChart size={20} className="text-[var(--text-muted)]" />
                    </div>

                    <div className="space-y-8">
                        {phases.map((phase, i) => {
                            const count = phaseCounts[phase] || 0;
                            const percentage = (count / (engagements.length || 1)) * 100;
                            
                            return (
                                <div key={phase}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-[var(--text-primary)]">{phase}</span>
                                        <span className="text-sm font-bold text-orange">{count} Projects</span>
                                    </div>
                                    <div className="h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(5, percentage)}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-orange rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Efficiency Score */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-3xl border border-[var(--border-color)] bg-orange text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h3 className="text-base font-bold mb-8">Studio Run-Rate</h3>
                        <div className="mb-8">
                            <p className="text-5xl font-display font-bold tracking-tighter mb-2">94%</p>
                            <p className="text-sm font-bold text-white/80">Optimal Efficiency</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Capacity</span>
                                <span>High</span>
                            </div>
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-4/5 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                    <FiTrendingUp className="absolute -right-8 -bottom-8 text-white/10" size={200} />
                </motion.div>
            </div>
        </div>
    );
}

