"use client";

import { Engagement, EngagementStage } from "@/lib/types/dashboard";
import { GROUPS, STAGE_GROUPS, STAGE_CONFIG } from "@/lib/stage-config";
import { FiCheckCircle, FiPlay } from "react-icons/fi";
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
        <div className="w-full lg:w-64 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 lg:sticky lg:top-28">
            {/* Desktop Navigation */}
            <div className="hidden lg:block space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-orange px-2">
                    Project Stages
                </h3>
                <nav className="space-y-1 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                    {GROUPS.map((group) => (
                        <div key={group.key} className="space-y-1 pt-2">
                            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider px-2 mb-1">{group.label}</p>
                            {STAGE_GROUPS[group.key as keyof typeof STAGE_GROUPS].stages.map((stageKey) => {
                                const config = STAGE_CONFIG[stageKey] || { label: stageKey, icon: null };
                                const state = engagement.stages[stageKey];
                                const isActive = activeStage === stageKey;
                                const isCompleted = state.status === "completed";
                                const isStarted = state.status === "active";

                                return (
                                    <button
                                        key={stageKey}
                                        onClick={() => onStageSelect(stageKey)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                                            isActive
                                                ? "bg-orange/10 text-orange font-bold"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                                        }`}
                                    >
                                        <div className="flex-shrink-0">
                                            {isCompleted ? (
                                                <FiCheckCircle size={14} className="text-green" />
                                            ) : isStarted ? (
                                                <FiPlay size={14} className="text-orange animate-pulse" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--border-color)]" />
                                            )}
                                        </div>
                                        <span className="text-xs truncate">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="h-[1px] bg-[var(--border-color)] my-4" />

                {/* Macro Progress */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Macro Progress</span>
                        <span className="text-[10px] font-bold text-orange">
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
            </div>

            {/* Mobile Dropdown Navigation */}
            <div className="block lg:hidden">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2">Current Active Stage</label>
                <select
                    value={activeStage}
                    onChange={(e) => onStageSelect(e.target.value as EngagementStage)}
                    className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange font-bold"
                >
                    {GROUPS.map((group) => (
                        <optgroup key={group.key} label={group.label.toUpperCase()}>
                            {STAGE_GROUPS[group.key as keyof typeof STAGE_GROUPS].stages.map((stageKey) => {
                                const config = STAGE_CONFIG[stageKey] || { label: stageKey };
                                return (
                                    <option key={stageKey} value={stageKey}>
                                        {config.label}
                                    </option>
                                );
                            })}
                        </optgroup>
                    ))}
                </select>
            </div>
        </div>
    );
}
