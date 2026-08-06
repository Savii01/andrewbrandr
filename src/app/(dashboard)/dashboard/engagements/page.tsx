"use client";

import { motion } from "framer-motion";
import { FiPlus, FiBriefcase, FiMoreVertical, FiExternalLink, FiLayout, FiGrid } from "react-icons/fi";
import { useState } from "react";
import NewEngagementModal from "@/components/dashboard/NewEngagementModal";
import { useActiveEngagements } from "@/lib/hooks/useDashboardData";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { getMacroProgress } from "@/lib/hooks/useDashboardData";
import { STAGE_CONFIG, STAGE_GROUPS } from "@/lib/stage-config";
import { EngagementStage } from "@/lib/types/dashboard";

const GROUPS = [
    { key: "commercial", label: "Commercial" },
    { key: "creative", label: "Creative" },
    { key: "delivery", label: "Delivery" }
];

export default function EngagementsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { engagements, loading } = useActiveEngagements();
    const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");

    const renderGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((eng) => {
                const progress = getMacroProgress(eng);
                const currentStageConfig = STAGE_CONFIG[eng.stagePrimary] || {
                    label: "Unknown Stage",
                    icon: FiBriefcase,
                    description: "No description available.",
                };
                
                return (
                    <motion.div
                        key={eng.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] hover:border-orange/30 hover:shadow-2xl hover:shadow-orange/5 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] text-orange border border-[var(--border-color)] group-hover:bg-orange group-hover:text-white transition-all">
                                <FiBriefcase size={20} />
                            </div>
                            <button className="text-[var(--text-muted)] hover:text-orange">
                                <FiMoreVertical size={18} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 truncate">{eng.projectName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[var(--text-muted)]">{eng.tier}</span>
                                <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                <span className="text-xs font-bold text-orange">{currentStageConfig.label}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-[var(--text-muted)]">Studio Progress</span>
                                <span className="text-xs font-bold text-orange">{progress}%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-orange rounded-full"
                                />
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/engagements/${eng.id}`}
                            className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--surface-elevated)] text-sm font-bold text-[var(--text-secondary)] hover:bg-orange hover:text-white transition-all"
                        >
                            Enter Workspace
                            <FiExternalLink size={12} />
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );

    const renderKanban = () => {
        return (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                {GROUPS.map((group) => {
                    const groupEngagements = engagements.filter(e => 
                        STAGE_GROUPS[group.key as keyof typeof STAGE_GROUPS].stages.includes(e.stagePrimary)
                    );
                    
                    return (
                        <div key={group.key} className="min-w-[340px] w-[340px] shrink-0 snap-start">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-widest">
                                    {group.label}
                                </h3>
                                <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                                    {groupEngagements.length}
                                </span>
                            </div>
                            
                            <div className="space-y-4 bg-[var(--surface-elevated)]/20 p-4 rounded-[2.5rem] min-h-[600px] border border-[var(--border-color)]">
                                {groupEngagements.map((eng) => {
                                    const progress = getMacroProgress(eng);
                                    const currentStageConfig = STAGE_CONFIG[eng.stagePrimary] || {
                                        label: "Unknown Stage",
                                        icon: FiBriefcase,
                                        description: "No description available.",
                                    };

                                    return (
                                        <motion.div
                                            key={eng.id}
                                            layoutId={eng.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface)] hover:border-orange/30 shadow-sm transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-[var(--text-primary)] text-sm truncate pr-4">{eng.projectName}</h4>
                                                <Link href={`/dashboard/engagements/${eng.id}`} className="text-[var(--text-muted)] hover:text-orange">
                                                    <FiExternalLink size={14} />
                                                </Link>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-1.5 rounded-md bg-orange/5 text-orange">
                                                    <currentStageConfig.icon size={12} />
                                                </div>
                                                <span className="text-[10px] font-bold text-orange uppercase tracking-wider">{currentStageConfig.label}</span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-1 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                                                    <div style={{ width: `${progress}%` }} className="h-full bg-orange rounded-full" />
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-[var(--text-muted)]">{eng.tier}</span>
                                                <Link 
                                                    href={`/dashboard/engagements/${eng.id}`}
                                                    className="text-[10px] font-bold text-orange uppercase tracking-widest"
                                                >
                                                    Open Workspace
                                                </Link>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };


    return (
        <div className="max-w-7xl mx-auto">
            <NewEngagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Studio Engagements
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        High-fidelity tracking of active client brand rooms
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-[var(--surface)] rounded-xl p-1 flex items-center">
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[var(--surface-elevated)] shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                        >
                            <FiGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode("kanban")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-[var(--surface-elevated)] shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                        >
                            <FiLayout size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-new-engagement-modal"))}
                        className="flex items-center gap-2 px-6 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10 cursor-pointer"
                    >
                        <FiPlus size={18} />
                        Initiate Project
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 rounded-3xl bg-[var(--surface)] border border-[var(--border-color)] animate-pulse" />
                    ))}
                </div>
            ) : engagements.length > 0 ? (
                viewMode === "grid" ? renderGrid() : renderKanban()
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed border-[var(--border-color)] bg-[var(--surface)] text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-muted)] mb-6">
                        <FiBriefcase size={32} />
                    </div>
                    <h3 className="text-xl font-display text-[var(--text-primary)] mb-2">No studio work found</h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto mb-8">
                        The studio is quiet. Initiate your first client engagement to begin tracking project rooms and strategy phases.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                    >
                        Initiate Project
                    </button>
                </div>
            )}
        </div>
    );
}
