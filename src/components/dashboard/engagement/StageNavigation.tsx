"use client";

import { Engagement, EngagementStage } from "@/lib/types/dashboard";
import { GROUPS, STAGE_GROUPS, STAGE_CONFIG } from "@/lib/stage-config";
import { FiCheckCircle, FiLock, FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";

interface StageNavigationProps {
    engagement: Engagement;
    activeStage: EngagementStage;
    onStageSelect: (stage: EngagementStage) => void;
}

export default function StageNavigation({
    engagement,
    activeStage,
    onStageSelect,
}: StageNavigationProps) {
    return (
        <nav className="w-80 border-r border-[var(--border-color)] bg-[var(--surface)] h-full overflow-y-auto hidden lg:block">
            <div className="p-8 space-y-10">
                {GROUPS.map((group) => (
                    <div key={group.key} className="space-y-4">
                        <h3 className="text-sm font-black text-orange px-4">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {STAGE_GROUPS[group.key as keyof typeof STAGE_GROUPS].stages.map((stageKey) => {
                                const config = STAGE_CONFIG[stageKey];
                                const state = engagement.stages[stageKey];
                                const isActive = activeStage === stageKey;
                                const isCompleted = state.status === "completed";
                                const isStarted = state.status === "active";

                                return (
                                    <button
                                        key={stageKey}
                                        onClick={() => onStageSelect(stageKey)}
                                        className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                            isActive
                                                ? "bg-orange/10 text-orange"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                                        }`}
                                    >
                                        <div className="relative">
                                            {isCompleted ? (
                                                <FiCheckCircle size={16} className="text-green" />
                                            ) : isStarted ? (
                                                <FiPlay size={16} className="text-orange animate-pulse" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-[var(--border-color)] group-hover:border-orange/50 transition-colors" />
                                            )}
                                        </div>
                                        <span className={`text-base font-black ${isActive ? "text-orange" : ""}`}>
                                            {config.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Studio Health Indicator */}
            <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-[var(--border-color)] bg-[var(--surface)]/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Macro Progress</span>
                    <span className="text-xs font-bold text-orange">
                        {Object.values(engagement.stages).filter(s => s.status === 'completed').length} / 9
                    </span>
                </div>
                <div className="h-1 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.values(engagement.stages).filter(s => s.status === 'completed').length / 9) * 100}%` }}
                        className="h-full bg-orange"
                    />
                </div>
            </div>
        </nav>
    );
}
