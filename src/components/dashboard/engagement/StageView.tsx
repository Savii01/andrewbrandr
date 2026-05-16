"use client";

import { Engagement, EngagementStage } from "@/lib/types/dashboard";
import { STAGE_CONFIG } from "@/lib/stage-config";
import { FiCheckCircle, FiPlay, FiInfo, FiLayers, FiFileText, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toggleMilestone, activateStage, completeStage, reopenStage } from "@/lib/firebase/engagements";

import GoogleDriveEmbed from "@/components/dashboard/integrations/GoogleDriveEmbed";
import GoogleCalendarEmbed from "@/components/dashboard/integrations/GoogleCalendarEmbed";
import GoogleFormsEmbed from "@/components/dashboard/integrations/GoogleFormsEmbed";
import ProposalView from "@/components/dashboard/engagement/documents/ProposalView";
import ContractView from "@/components/dashboard/engagement/documents/ContractView";

interface StageViewProps {
    engagement: Engagement;
    stageKey: EngagementStage;
    isClient?: boolean;
}

export default function StageView({
    engagement,
    stageKey,
    isClient = false
}: StageViewProps) {
    const config = STAGE_CONFIG[stageKey];
    const state = engagement.stages[stageKey];
    const milestones = engagement.milestones?.[stageKey] || {};

    const handleToggleMilestone = async (key: string, current: boolean) => {
        await toggleMilestone(engagement.id, stageKey, key, !current);
    };

    const handleActivate = async () => {
        await activateStage(engagement.id, stageKey);
    };

    const handleComplete = async () => {
        await completeStage(engagement.id, stageKey);
    };

    const handleReopen = async () => {
        await reopenStage(engagement.id, stageKey);
    };

    const isCompleted = state.status === "completed";
    const isActive = state.status === "active";

    const renderIntegrations = () => {
        switch (stageKey) {
            case "discovery":
                return <GoogleFormsEmbed formUrl={engagement.briefUrl} title="Project Discovery Brief" />;
            case "proposal":
                return (
                    <ProposalView 
                        data={{
                            title: `Brand Evolution: ${engagement.projectName}`,
                            description: "Strategic expansion and identity refinement for high-growth market positioning.",
                            scope: ["Brand Identity Refinement", "Digital Strategy", "Systems Implementation"],
                            investment: [
                                { label: "Design Fee", amount: 1500000 },
                                { label: "Studio Retainer (Monthly)", amount: 250000 }
                            ],
                            status: "pending"
                        }}
                        isAdmin={!isClient}
                    />
                );
            case "strategy":
                return (
                    <div className="space-y-12">
                        <GoogleCalendarEmbed events={[]} />
                        <ContractView 
                            data={{
                                title: "Master Services Agreement",
                                clientName: engagement.projectName,
                                date: "2026-05-15",
                                terms: [
                                    "Project scope as defined in the approved proposal.",
                                    "Intellectual property transfer upon final payment.",
                                    "Confidentiality and non-disclosure terms apply."
                                ],
                                status: "sent"
                            }}
                        />
                    </div>
                );
            case "presentation":
                return (
                    <div className="space-y-10">
                        <GoogleCalendarEmbed events={[]} />
                        <GoogleDriveEmbed files={[]} />
                    </div>
                );
            case "delivery":
                return <GoogleDriveEmbed folderUrl={engagement.driveFolderId} files={[]} />;
            default:
                return (
                    <div className="p-8 rounded-[2rem] bg-[var(--surface)] border border-[var(--border-color)] space-y-6">
                        <h3 className="text-xs font-bold text-[var(--text-muted)]">Connected Assets</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-dashed border-[var(--border-color)] text-center">
                                <p className="text-xs font-bold text-[var(--text-muted)]">No assets linked for this stage</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-8">
            {/* ... header code ... */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-orange/10 text-orange' : isCompleted ? 'bg-green/10 text-green' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}>
                            <config.icon size={20} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            isCompleted ? 'bg-green text-white' : 
                            isActive ? 'bg-orange text-white' : 
                            'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                        }`}>
                            {state.status.replace('_', ' ')}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black font-display text-[var(--text-primary)]">{config.label}</h1>
                    <p className="text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
                        {config.description}
                    </p>
                </div>

                {!isClient && (
                    <div className="flex items-center gap-3">
                        {state.status === "not_started" && (
                            <button 
                                onClick={handleActivate}
                                className="flex items-center gap-2 px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/20"
                            >
                                <FiPlay size={14} />
                                Activate Stage
                            </button>
                        )}
                        {isActive && (
                            <button 
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-8 py-3 bg-green text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-green/10"
                            >
                                <FiCheckCircle size={14} />
                                Complete Stage
                            </button>
                        )}
                        {isCompleted && (
                            <button 
                                onClick={handleReopen}
                                className="flex items-center gap-2 px-8 py-3 bg-[var(--surface-elevated)] text-[var(--text-primary)] text-sm font-bold rounded-xl hover:bg-orange hover:text-white transition-all border border-[var(--border-color)]"
                            >
                                <FiPlay size={14} />
                                Reopen Stage
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Milestones & Notes */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Milestones */}
                    <section className="p-8 rounded-[2rem] bg-[var(--surface)] border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <FiLayers className="text-orange" />
                                <h3 className="text-base font-black">Micro Progress</h3>
                            </div>
                            <span className="text-sm font-bold text-orange">
                                {Object.values(milestones).filter(Boolean).length} / {Object.keys(milestones).length} Done
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            {Object.entries(milestones).map(([key, completed]) => (
                                <button
                                    key={key}
                                    onClick={() => !isClient && handleToggleMilestone(key, !!completed)}
                                    disabled={isClient}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                        isClient ? 'cursor-default' : 'cursor-pointer'
                                    } ${
                                        completed 
                                            ? 'bg-orange/5 border-orange/10 text-[var(--text-primary)]' 
                                            : 'bg-[var(--surface-elevated)]/50 border-transparent text-[var(--text-secondary)] hover:border-[var(--border-color)]'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                        completed ? 'bg-orange border-orange text-white' : 'bg-transparent border-[var(--border-color)]'
                                    }`}>
                                        {completed && <FiCheckCircle size={12} />}
                                    </div>
                                    <span className={`text-base font-medium ${completed ? 'line-through opacity-50' : ''}`}>{key}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Stage Notes / Content */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <FiFileText className="text-orange" />
                            <h3 className="text-base font-black">Stage Documentation</h3>
                        </div>
                        <div className="min-h-[300px] p-8 rounded-[2rem] bg-[var(--surface)] border border-[var(--border-color)]">
                             <p className="text-[var(--text-muted)] text-base text-center py-20 italic">
                                Documentation workspace for this stage will be integrated here.
                             </p>
                        </div>
                    </section>

                    {/* Activity Log */}
                    <section className="space-y-6 pb-20">
                        <div className="flex items-center gap-3 px-2">
                            <FiClock className="text-orange" />
                            <h3 className="text-base font-black">Activity Log</h3>
                        </div>
                        <div className="space-y-4">
                            {engagement.stageHistory?.filter(log => log.stage === stageKey).length ? (
                                engagement.stageHistory
                                    .filter(log => log.stage === stageKey)
                                    .reverse()
                                    .map((log, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)]">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-primary)] capitalize">{log.action}</p>
                                                <p className="text-sm text-[var(--text-muted)] font-bold mt-1">
                                                    {log.at.toDate().toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="p-8 rounded-[2rem] bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center">
                                     <p className="text-sm font-bold text-[var(--text-muted)]">No activity recorded for this stage</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Stage Intelligence / Embeds */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[2rem] bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                        <h3 className="text-sm font-bold text-orange mb-6 flex items-center gap-2">
                            <FiInfo size={14} />
                            Stage Context
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-bold text-[var(--text-muted)] mb-2">Prerequisites</p>
                                <div className="flex flex-wrap gap-2">
                                    {config.softDependencies.length > 0 ? config.softDependencies.map(dep => (
                                        <span key={dep} className="px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] capitalize">
                                            {dep}
                                        </span>
                                    )) : (
                                        <span className="text-sm font-bold text-[var(--text-muted)] italic">No dependencies</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="h-[1px] bg-[var(--border-color)]" />
                            
                            <div>
                                <p className="text-sm font-bold text-[var(--text-muted)] mb-2">Expected Outcome</p>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    This stage ensures a solid foundation before moving into the creative phase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Integration Slots */}
                    <div className="space-y-6">
                         {renderIntegrations()}
                    </div>
                </div>
            </div>
        </div>
    );
}
