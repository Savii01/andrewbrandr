"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiMoreVertical, FiShare2, FiExternalLink, FiCheck, FiLink } from "react-icons/fi";
import { useEngagement, getMacroProgress } from "@/lib/hooks/useDashboardData";
import { EngagementStage } from "@/lib/types/dashboard";
import { STAGE_CONFIG, checkSoftDependencies } from "@/lib/stage-config";
import { activateStage } from "@/lib/firebase/engagements";

import StageNavigation from "@/components/dashboard/engagement/StageNavigation";
import StageView from "@/components/dashboard/engagement/StageView";
import StageDependencyWarning from "@/components/dashboard/engagement/StageDependencyWarning";

export default function EngagementDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { engagement, loading } = useEngagement(id as string);
    
    // State for the nested workspace navigation
    const [activeStage, setActiveStage] = useState<EngagementStage>("discovery");
    
    // Warning Modal State
    const [warningOpen, setWarningOpen] = useState(false);
    const [pendingStage, setPendingStage] = useState<EngagementStage | null>(null);
    const [incompleteDeps, setIncompleteDeps] = useState<string[]>([]);

    const [copied, setCopied] = useState(false);

    const handleCopyPortal = () => {
        if (!engagement) return;
        const url = `${window.location.origin}/portal/${engagement.portalToken}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Sync activeStage with engagement primary stage on load
    useEffect(() => {
        if (engagement && !activeStage) {
            setActiveStage(engagement.stagePrimary);
        }
    }, [engagement]);

    if (loading) return (
        <div className="fixed inset-0 bg-[var(--background)] z-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-orange/20 border-t-orange rounded-full animate-spin" />
                <p className="text-xs font-bold text-[var(--text-muted)]">Syncing Studio Workspace...</p>
             </div>
        </div>
    );

    if (!engagement) return (
        <div className="text-center p-20">
            <p className="text-[var(--text-muted)]">Engagement room not found.</p>
            <button onClick={() => router.push("/dashboard/engagements")} className="text-orange mt-4">Back to Engagements</button>
        </div>
    );

    const handleStageChange = (stage: EngagementStage) => {
        const state = engagement.stages[stage];
        
        // If stage is not started, check for soft dependencies
        if (state.status === "not_started") {
            const warnings = checkSoftDependencies(stage, engagement.stages);
            if (warnings.length > 0) {
                setIncompleteDeps(warnings);
                setPendingStage(stage);
                setWarningOpen(true);
                return;
            }
        }
        
        setActiveStage(stage);
    };

    const confirmActivation = async () => {
        if (pendingStage) {
            await activateStage(engagement.id, pendingStage);
            setActiveStage(pendingStage);
            setPendingStage(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-[var(--background)] z-[60] flex overflow-hidden">
            {/* Nested Stage Sidebar */}
            <aside className="w-64 h-full border-r border-[var(--border-color)]">
                <StageNavigation 
                    engagement={engagement} 
                    activeStage={activeStage}
                    onStageSelect={handleStageChange}
                />
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 h-full flex flex-col overflow-hidden bg-[var(--background)]">
                {/* Workspace Header */}
                <header className="h-20 border-b border-[var(--border-color)] bg-[var(--surface)]/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.push("/dashboard/engagements")}
                            className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] transition-all text-[var(--text-muted)] hover:text-orange"
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        
                        <div>
                            <p className="text-xs font-black text-[var(--text-muted)] mb-1">TOTAL PROGRESS</p>
                            <h1 className="text-2xl font-black text-[var(--text-primary)]">
                                {engagement.projectName}
                                <span className="ml-4 text-xs font-black text-orange">{getMacroProgress(engagement)}%</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-xl">
                            <div>
                                <p className="text-xs font-bold text-[var(--text-muted)]">Active Session</p>
                                <p className="text-xs font-bold text-[var(--text-primary)]">AndrewBrandr Studio</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-orange/10 flex items-center justify-center relative">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="transparent"
                                        className="text-orange/10"
                                    />
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="transparent"
                                        strokeDasharray={113.1}
                                        strokeDashoffset={113.1 - (113.1 * getMacroProgress(engagement)) / 100}
                                        className="text-orange"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                    {Object.values(engagement.stages).filter(s => s.status === "completed").length}
                                </span>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-[var(--border-color)] mx-2" />

                        <button 
                            onClick={handleCopyPortal}
                            className={`p-3 rounded-xl border border-[var(--border-color)] transition-all ${copied ? 'bg-green/10 text-green border-green' : 'hover:bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}
                            title="Copy Portal Link"
                        >
                            {copied ? <FiCheck size={16} /> : <FiLink size={16} />}
                        </button>
                        <button className="p-3 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-all">
                            <FiShare2 size={16} />
                        </button>
                        <button className="p-3 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-all">
                            <FiMoreVertical size={16} />
                        </button>
                        <button 
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)] text-white text-xs font-bold rounded-xl hover:bg-orange transition-all"
                        >
                            Client View
                            <FiExternalLink size={14} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StageView engagement={engagement} stageKey={activeStage} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Dependency Warning Modal */}
            <StageDependencyWarning 
                isOpen={warningOpen}
                onClose={() => {
                    setWarningOpen(false);
                    setPendingStage(null);
                }}
                onProceed={confirmActivation}
                targetStageLabel={pendingStage ? STAGE_CONFIG[pendingStage].label : ""}
                incompleteDependencies={incompleteDeps}
            />
        </div>
    );
}
