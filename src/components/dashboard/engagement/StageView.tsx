"use client";

import { useState, useEffect } from "react";
import { Engagement, EngagementStage } from "@/lib/types/dashboard";
import { STAGE_CONFIG } from "@/lib/stage-config";
import { FiCheckCircle, FiPlay, FiInfo, FiLayers, FiFileText, FiClock, FiDollarSign, FiLock, FiUnlock, FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { 
    toggleMilestone, 
    activateStage, 
    completeStage, 
    reopenStage, 
    markDepositPaid, 
    markFinalPaid,
    updateStageDocumentation,
    addStageMilestone,
    deleteStageMilestone,
    updateEngagementPrice
} from "@/lib/firebase/engagements";

import GoogleDriveEmbed from "@/components/dashboard/integrations/GoogleDriveEmbed";
import GoogleCalendarEmbed from "@/components/dashboard/integrations/GoogleCalendarEmbed";
import GoogleFormsEmbed from "@/components/dashboard/integrations/GoogleFormsEmbed";
import DiscoveryCallScheduler from "@/components/dashboard/engagement/DiscoveryCallScheduler";
import ProposalView from "@/components/dashboard/engagement/documents/ProposalView";
import ContractView from "@/components/dashboard/engagement/documents/ContractView";
import { TIER_CONFIG, getTierDefaultPrice } from "@/lib/constants/tierConfig";

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
    const config = STAGE_CONFIG[stageKey] || { label: "Unknown Stage", description: "No description available.", defaultMilestones: [], softDependencies: [], group: "commercial" as const, icon: null };
    const state = engagement.stages[stageKey];
    const milestones = engagement.milestones?.[stageKey] || {};

    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [priceInput, setPriceInput] = useState("");
    const [isEditingDoc, setIsEditingDoc] = useState(false);
    const [docContent, setDocContent] = useState("");
    const [newTaskName, setNewTaskName] = useState("");
    const [isAddingTask, setIsAddingTask] = useState(false);

    useEffect(() => {
        setDocContent(state.documentation || "");
        setIsEditingDoc(false);
    }, [stageKey, state.documentation]);

    const totalAmount = getTierDefaultPrice(engagement.tier, engagement.customPrice);
    const tierInfo = TIER_CONFIG[engagement.tier] || TIER_CONFIG.Clarity;

    useEffect(() => {
        setPriceInput(totalAmount.toString());
        setIsEditingPrice(false);
    }, [engagement.customPrice, engagement.tier]);

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
                return (
                    <div className="space-y-4">
                        <GoogleFormsEmbed formUrl={engagement.briefUrl} title="Project Discovery Brief" />
                    </div>
                );
            case "proposal":
                return (
                    <ProposalView 
                        data={{
                            title: `${tierInfo.name}: ${engagement.projectName}`,
                            description: tierInfo.description,
                            scope: tierInfo.scope,
                            investment: [
                                { label: `${tierInfo.name} Fee`, amount: totalAmount }
                            ],
                            status: "pending",
                            paymentStructure: engagement.paymentStructure || "twice"
                        }}
                        isAdmin={!isClient}
                    />
                );
            case "strategy":
                return (
                    <div className="space-y-6">
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
                    <div className="space-y-6">
                        <GoogleCalendarEmbed events={[]} />
                        <GoogleDriveEmbed files={[]} />
                    </div>
                );
            case "delivery":
                return <GoogleDriveEmbed folderUrl={engagement.driveFolderId} files={[]} />;
            default:
                return (
                    <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] space-y-4">
                        <h3 className="text-xs font-bold text-[var(--text-muted)]">Connected Assets</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-dashed border-[var(--border-color)] text-center">
                                <p className="text-xs font-bold text-[var(--text-muted)]">No assets linked for this stage</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const renderBillingWidget = () => {
        const isOnce = engagement.paymentStructure === "once";
        const depositPaid = engagement.depositPaid;
        const finalPaid = engagement.finalPaid;
        const isDiscovery = stageKey === "discovery";

        return (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-orange flex items-center gap-2">
                        <FiDollarSign size={14} />
                        Commercial Status
                    </h3>
                    {!isClient && !isDiscovery && (
                        <button
                            onClick={() => {
                                setPriceInput(totalAmount.toString());
                                setIsEditingPrice(!isEditingPrice);
                            }}
                            className="text-[10px] font-black text-[var(--text-muted)] hover:text-orange flex items-center gap-1 transition-colors"
                        >
                            <FiEdit2 size={10} />
                            Adjust Price
                        </button>
                    )}
                </div>

                {isEditingPrice ? (
                    <div className="space-y-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                        <p className="text-[10px] font-bold text-[var(--text-primary)]">Adjust Project Value</p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={priceInput}
                                onChange={(e) => setPriceInput(e.target.value)}
                                className="flex-1 bg-[var(--surface)] text-[var(--text-primary)] border-none rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange font-bold"
                            />
                            <button
                                onClick={async () => {
                                    await updateEngagementPrice(engagement.id, Number(priceInput));
                                    setIsEditingPrice(false);
                                }}
                                className="p-2 bg-green text-white rounded-lg hover:bg-black transition-colors"
                                title="Save"
                            >
                                <FiSave size={12} />
                            </button>
                            <button
                                onClick={() => setIsEditingPrice(false)}
                                className="p-2 bg-[var(--surface)] text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-colors border border-[var(--border-color)]"
                                title="Cancel"
                            >
                                <FiX size={12} />
                            </button>
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)]">Input contract price including discounts, scope adjustments, or tax.</p>
                    </div>
                ) : null}
                
                <div className="space-y-4">
                    {/* Terms Label */}
                    <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
                        <span>Payment Terms</span>
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                            {isOnce ? "100% Upfront" : "50/50 Split"}
                        </span>
                    </div>

                    <div className="h-[1px] bg-[var(--border-color)]" />

                    {isDiscovery ? (
                        <div className="p-4 rounded-xl bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center space-y-1">
                            <FiLock className="mx-auto text-[var(--text-muted)] mb-1" size={16} />
                            <p className="text-xs font-bold text-[var(--text-primary)]">Billing Inactive</p>
                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Commercial status locks until Discovery is completed and the Proposal is presented.</p>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Upfront or Deposit */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-[var(--text-secondary)]">{isOnce ? "Full Upfront Payment" : "1. Deposit (50%)"}</span>
                                    <span className="text-[var(--text-primary)]">₦{(isOnce ? totalAmount : totalAmount * 0.5).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                                        depositPaid ? 'text-green' : 'text-orange'
                                    }`}>
                                        {depositPaid ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                        {depositPaid ? 'Cleared & Verified' : 'Awaiting Payment'}
                                    </span>
                                    {!isClient && !depositPaid && (
                                        <button
                                            onClick={async () => {
                                                await markDepositPaid(engagement.id);
                                            }}
                                            className="px-3 py-1.5 bg-orange text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors"
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Final Payment (only for split terms) */}
                            {!isOnce && (
                                <>
                                    <div className="h-[1px] bg-[var(--border-color)]" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-[var(--text-secondary)]">2. Final Balance (50%)</span>
                                            <span className="text-[var(--text-primary)]">₦{(totalAmount * 0.5).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                                                finalPaid ? 'text-green' : !depositPaid ? 'text-[var(--text-muted)]' : 'text-orange'
                                            }`}>
                                                {!depositPaid ? <FiLock size={12} /> : finalPaid ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                                {!depositPaid ? 'Locked (Requires Deposit)' : finalPaid ? 'Cleared & Verified' : 'Awaiting Delivery'}
                                            </span>
                                            {!isClient && depositPaid && !finalPaid && (
                                                <button
                                                    onClick={async () => {
                                                        await markFinalPaid(engagement.id);
                                                    }}
                                                    className="px-3 py-1.5 bg-orange text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-orange/10 text-orange' : isCompleted ? 'bg-green/10 text-green' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}>
                            <config.icon size={18} />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isCompleted ? 'bg-green text-white' : 
                            isActive ? 'bg-orange text-white' : 
                            'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                        }`}>
                            {state.status.replace('_', ' ')}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black font-display text-[var(--text-primary)]">{config.label}</h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                        {config.description}
                    </p>
                </div>

                {!isClient && (
                    <div className="flex items-center gap-3">
                        {state.status === "not_started" && (
                            <button 
                                onClick={handleActivate}
                                className="flex items-center gap-2 px-6 py-2.5 bg-orange text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20"
                            >
                                <FiPlay size={12} />
                                Activate Stage
                            </button>
                        )}
                        {isActive && (
                            <button 
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-green/10"
                            >
                                <FiCheckCircle size={12} />
                                Complete Stage
                            </button>
                        )}
                        {isCompleted && (
                            <button 
                                onClick={handleReopen}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-bold rounded-xl hover:bg-orange hover:text-white transition-all border border-[var(--border-color)]"
                            >
                                <FiPlay size={12} />
                                Reopen Stage
                            </button>
                        )}
                    </div>
                )}
            </div>

            {stageKey === "discovery" && (
                <DiscoveryCallScheduler engagement={engagement} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Milestones & Documentation */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Milestones */}
                    <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <FiLayers className="text-orange" />
                                <h3 className="text-sm font-black">Micro Progress</h3>
                            </div>
                            <span className="text-xs font-bold text-orange">
                                {Object.values(milestones).filter(Boolean).length} / {Object.keys(milestones).length} Done
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            {Object.entries(milestones).map(([key, completed]) => (
                                <div key={key} className="flex items-center gap-2 w-full group">
                                    <button
                                        onClick={() => !isClient && handleToggleMilestone(key, !!completed)}
                                        disabled={isClient}
                                        className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                            isClient ? 'cursor-default' : 'cursor-pointer'
                                        } ${
                                            completed 
                                                ? 'bg-orange/5 border-orange/10 text-[var(--text-primary)]' 
                                                : 'bg-[var(--surface-elevated)]/50 border-transparent text-[var(--text-secondary)] hover:border-[var(--border-color)]'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                            completed ? 'bg-orange border-orange text-white' : 'bg-transparent border-[var(--border-color)]'
                                        }`}>
                                            {completed && <FiCheckCircle size={10} />}
                                        </div>
                                        <span className={`text-xs font-bold truncate ${completed ? 'line-through opacity-50' : ''}`}>{key}</span>
                                    </button>
                                    {!isClient && (
                                        <button
                                            onClick={async () => {
                                                await deleteStageMilestone(engagement.id, stageKey, key);
                                            }}
                                            className="p-3 text-[var(--text-muted)] hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
                                            title="Delete Task"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {!isClient && (
                                <div className="pt-2">
                                    {isAddingTask ? (
                                        <div className="flex gap-2 p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                                            <input
                                                type="text"
                                                value={newTaskName}
                                                onChange={(e) => setNewTaskName(e.target.value)}
                                                placeholder="Write custom task name..."
                                                className="flex-1 bg-[var(--surface)] text-[var(--text-primary)] border-none rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange font-bold"
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (newTaskName.trim()) {
                                                        await addStageMilestone(engagement.id, stageKey, newTaskName.trim());
                                                        setNewTaskName("");
                                                        setIsAddingTask(false);
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-orange text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => setIsAddingTask(false)}
                                                className="p-1.5 bg-[var(--surface)] text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-colors border border-[var(--border-color)]"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsAddingTask(true)}
                                            className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl border border-dashed border-[var(--border-color)] hover:border-orange hover:bg-orange/5 text-xs font-bold text-[var(--text-muted)] hover:text-orange transition-all"
                                        >
                                            <FiPlus size={14} />
                                            Add Custom Task
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Stage Notes / Content */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <FiFileText className="text-orange" />
                                <h3 className="text-sm font-black">Stage Documentation</h3>
                            </div>
                            {!isClient && !isEditingDoc && (
                                <button
                                    onClick={() => {
                                        setDocContent(state.documentation || "");
                                        setIsEditingDoc(true);
                                    }}
                                    className="text-xs font-bold text-[var(--text-muted)] hover:text-orange flex items-center gap-1 transition-colors"
                                >
                                    <FiEdit2 size={12} />
                                    Edit Documentation
                                </button>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] min-h-[250px]">
                            {isEditingDoc ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={docContent}
                                        onChange={(e) => setDocContent(e.target.value)}
                                        placeholder="Write structured stage documentation, deliverables details, strategy context..."
                                        rows={8}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-4 text-xs font-bold focus:ring-1 focus:ring-orange leading-relaxed"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={async () => {
                                                await updateStageDocumentation(engagement.id, stageKey, docContent);
                                                setIsEditingDoc(false);
                                            }}
                                            className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg hover:bg-black transition-colors flex items-center gap-1.5"
                                        >
                                            <FiSave size={12} />
                                            Save Notes
                                        </button>
                                        <button
                                            onClick={() => setIsEditingDoc(false)}
                                            className="px-4 py-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-bold rounded-lg hover:bg-orange hover:text-white transition-colors border border-[var(--border-color)]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none text-xs font-medium text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                                    {state.documentation ? (
                                        state.documentation
                                    ) : (
                                        <p className="text-[var(--text-muted)] text-xs text-center py-16 italic">
                                            No documentation has been recorded for this stage yet.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Activity Log */}
                    <section className="space-y-4 pb-20">
                        <div className="flex items-center gap-3 px-2">
                            <FiClock className="text-orange" />
                            <h3 className="text-sm font-black">Activity Log</h3>
                        </div>
                        <div className="space-y-3">
                            {engagement.stageHistory?.filter(log => log.stage === stageKey).length ? (
                                engagement.stageHistory
                                    .filter(log => log.stage === stageKey)
                                    .reverse()
                                    .map((log, i) => (
                                        <div key={i} className="flex gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-primary)] capitalize">{log.action}</p>
                                                <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1">
                                                    {log.at.toDate().toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                             ) : (
                                <div className="p-6 rounded-xl bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center">
                                     <p className="text-xs font-bold text-[var(--text-muted)]">No activity recorded for this stage</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Stage Intelligence & Billing */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                        <h3 className="text-xs font-bold text-orange mb-4 flex items-center gap-2">
                            <FiInfo size={12} />
                            Stage Context
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] mb-1">Prerequisites</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {config.softDependencies.length > 0 ? config.softDependencies.map(dep => (
                                        <span key={dep} className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-secondary)] capitalize">
                                            {dep}
                                        </span>
                                    )) : (
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] italic">No dependencies</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="h-[1px] bg-[var(--border-color)]" />
                            
                            <div>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] mb-1">Expected Outcome</p>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                                    This stage ensures a solid foundation before moving into the creative phase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Billing Context */}
                    {renderBillingWidget()}

                    {/* Integration Slots */}
                    <div className="space-y-4">
                         {renderIntegrations()}
                    </div>
                </div>
            </div>
        </div>
    );
}
