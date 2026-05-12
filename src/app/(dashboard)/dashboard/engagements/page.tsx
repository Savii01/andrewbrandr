"use client";

import { motion } from "framer-motion";
import { FiPlus, FiBriefcase, FiMoreVertical, FiExternalLink, FiLayout, FiGrid } from "react-icons/fi";
import { useState } from "react";
import NewEngagementModal from "@/components/dashboard/NewEngagementModal";
import { useActiveEngagements } from "@/lib/hooks/useDashboardData";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

const PHASES = ["Strategy", "Design", "Systems", "Execution"];

export default function EngagementsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { engagements, loading } = useActiveEngagements();
    const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");

    const handleMovePhase = async (engId: string, newPhase: string) => {
        try {
            await updateDoc(doc(db, "engagements", engId), {
                phase: newPhase,
                // Automatically bump progress based on phase (simplified)
                progress: newPhase === "Strategy" ? 10 : newPhase === "Design" ? 40 : newPhase === "Systems" ? 70 : 90
            });
        } catch (error) {
            console.error("Failed to update phase", error);
        }
    };

    const renderGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((eng) => (
                <motion.div
                    key={eng.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-orange/30 hover:shadow-2xl hover:shadow-orange/5 transition-all group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-lil-black text-orange border border-gray-100 dark:border-gray-800 group-hover:bg-orange group-hover:text-white transition-all">
                            <FiBriefcase size={20} />
                        </div>
                        <button className="text-[var(--text-muted)] hover:text-orange">
                            <FiMoreVertical size={18} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 truncate">{eng.clientName}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">{eng.tier}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-orange">{eng.phase} Phase</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Progress</span>
                            <span className="text-[10px] font-bold text-orange">{eng.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-lil-black rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${eng.progress}%` }}
                                className="h-full bg-orange rounded-full"
                            />
                        </div>
                    </div>

                    <Link
                        href={`/dashboard/engagements/${eng.id}`}
                        className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 dark:bg-lil-black text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] hover:bg-orange hover:text-white transition-all"
                    >
                        Enter Room
                        <FiExternalLink size={12} />
                    </Link>
                </motion.div>
            ))}
        </div>
    );

    const renderKanban = () => {
        return (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                {PHASES.map((phase) => {
                    const phaseEngagements = engagements.filter(e => e.phase === phase);
                    
                    return (
                        <div key={phase} className="min-w-[320px] w-[320px] shrink-0 snap-start">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-[var(--text-primary)] text-sm tracking-widest uppercase">
                                    {phase}
                                </h3>
                                <span className="text-xs font-bold text-[var(--text-muted)] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                    {phaseEngagements.length}
                                </span>
                            </div>
                            
                            <div className="space-y-4 bg-gray-50/50 dark:bg-black/20 p-4 rounded-3xl min-h-[500px] border border-gray-100 dark:border-gray-800">
                                {phaseEngagements.map((eng) => (
                                    <motion.div
                                        key={eng.id}
                                        layoutId={eng.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-orange/30 shadow-sm transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm">{eng.clientName}</h4>
                                            <Link href={`/dashboard/engagements/${eng.id}`} className="text-[var(--text-muted)] hover:text-orange">
                                                <FiExternalLink size={14} />
                                            </Link>
                                        </div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4">{eng.tier}</p>
                                        
                                        {/* Simplified progress bar */}
                                        <div className="h-1 bg-gray-100 dark:bg-lil-black rounded-full overflow-hidden mb-4">
                                            <div style={{ width: `${eng.progress}%` }} className="h-full bg-orange rounded-full" />
                                        </div>

                                        <div className="flex justify-between mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                                            <select 
                                                className="text-[10px] uppercase bg-transparent text-[var(--text-secondary)] font-bold cursor-pointer outline-none w-full"
                                                value={eng.phase}
                                                onChange={(e) => handleMovePhase(eng.id, e.target.value)}
                                            >
                                                <option value="" disabled>Move to...</option>
                                                {PHASES.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </motion.div>
                                ))}
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
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-1 flex items-center">
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-lil-black shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                        >
                            <FiGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode("kanban")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-white dark:bg-lil-black shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                        >
                            <FiLayout size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                    >
                        <FiPlus size={18} />
                        Initiate Project
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : engagements.length > 0 ? (
                viewMode === "grid" ? renderGrid() : renderKanban()
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-lil-black flex items-center justify-center text-[var(--text-muted)] mb-6">
                        <FiBriefcase size={32} />
                    </div>
                    <h3 className="text-xl font-display text-[var(--text-primary)] mb-2">No studio work found</h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto mb-8">
                        The studio is quiet. Initiate your first client engagement to begin tracking project rooms and strategy phases.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                    >
                        Initiate Project
                    </button>
                </div>
            )}
        </div>
    );
}
