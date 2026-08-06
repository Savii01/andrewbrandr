"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLayers, FiCheckCircle, FiPlus, FiAlertCircle } from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { createEngagement, createClient, updateEngagement } from "@/lib/firebase/engagements";
import { EngagementTier } from "@/lib/types/dashboard";
import { TIER_CONFIG } from "@/lib/constants/tierConfig";

export default function NewEngagementModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        clientName: "",
        projectName: "",
        clientEmail: "",
        industry: "",
        tier: "Clarity" as EngagementTier,
        revenue: TIER_CONFIG.Clarity.defaultPriceNGN,
        autoRenew: false,
        paymentStructure: "twice" as "once" | "twice",
    });

    const handleNextStep = () => {
        setError(null);
        if (step === 1) {
            if (!formData.clientName.trim()) {
                setError("Please enter the client name before continuing.");
                return;
            }
        }
        if (step === 2) {
            if (formData.tier === "Enterprise" && (!formData.revenue || formData.revenue <= 0)) {
                setError("Please enter the agreed custom contract value for Stage 04 Enterprise.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleModalClose = () => {
        setError(null);
        setStep(1);
        setFormData({
            clientName: "",
            projectName: "",
            clientEmail: "",
            industry: "",
            tier: "Clarity" as EngagementTier,
            revenue: TIER_CONFIG.Clarity.defaultPriceNGN,
            autoRenew: false,
            paymentStructure: "twice" as "once" | "twice",
        });
        onClose();
    };

    const handleSubmit = async () => {
        if (!db) {
            setError("Database connection not ready. Check your setup.");
            return;
        }

        setLoading(true);
        setError(null);

        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Studio backend timed out.")), 15000)
        );

        try {
            await Promise.race([
                (async () => {
                    const clientId = await createClient({
                        name: formData.clientName,
                        email: formData.clientEmail,
                        industry: formData.industry,
                    });

                    const newEngId = await createEngagement({
                        clientIds: [clientId],
                        projectName: formData.projectName || `${formData.clientName} Brand Project`,
                        tier: formData.tier,
                        paymentStructure: formData.paymentStructure,
                        customPrice: formData.revenue,
                    });

                    // Auto-provision Google Drive folder structure in background
                    fetch("/api/drive/create-folder", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            clientName: formData.clientName,
                            packageName: formData.tier,
                            engagementId: newEngId,
                        }),
                    })
                        .then((res) => res.json())
                        .then(async (resData) => {
                            if (resData.success && resData.rootFolderUrl) {
                                await updateEngagement(newEngId, { driveFolderId: resData.rootFolderUrl });
                            }
                        })
                        .catch((err) => console.error("Drive auto-provision error:", err));
                })(),
                timeout
            ]);

            handleModalClose();
        } catch (err: any) {
            console.error("Error creating engagement:", err);
            setError(err.message || "Failed to initialize engagement. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleModalClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Form Header */}
                <div className="p-8 border-b border-[var(--border-color)] bg-[var(--surface-elevated)]/50">
                    <div className="flex items-center gap-3 text-orange mb-2">
                        <FiPlus size={20} />
                        <span className="text-xs font-bold">Studio Intake</span>
                    </div>
                    <h2 className="text-2xl font-display text-[var(--text-primary)]">Initiate New Engagement</h2>
                </div>

                {/* Form Progress */}
                <div className="flex h-1 bg-[var(--surface-elevated)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="bg-orange h-full"
                    />
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
                            <FiAlertCircle size={18} />
                            {error}
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)]">Client Name</label>
                                        <input
                                            type="text"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)]">Project Name</label>
                                        <input
                                            type="text"
                                            value={formData.projectName}
                                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Nexova Branding"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)]">Industry</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Tech Services"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)]">Client Email</label>
                                        <input
                                            type="email"
                                            value={formData.clientEmail}
                                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="client@example.com"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[var(--text-muted)]">Engagement Tier</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["Foundation", "Clarity", "Scale", "Enterprise"] as EngagementTier[]).map((tier) => (
                                            <button
                                                key={tier}
                                                type="button"
                                                onClick={() => {
                                                    const price = TIER_CONFIG[tier]?.defaultPriceNGN || 0;
                                                    setFormData({
                                                        ...formData,
                                                        tier: tier,
                                                        revenue: price,
                                                    });
                                                }}
                                                className={`p-3 rounded-xl text-xs font-bold border transition-all ${formData.tier === tier
                                                        ? 'bg-orange/10 border-orange text-orange'
                                                        : 'bg-[var(--surface-elevated)] border-transparent text-[var(--text-muted)] hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                                                    }`}
                                            >
                                                {tier}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-[var(--text-muted)]">Contract Value (₦)</label>
                                        {formData.tier === "Enterprise" && (
                                            <span className="text-[10px] font-bold text-orange uppercase tracking-wider">Custom Scope (Input Price)</span>
                                        )}
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.revenue || ""}
                                        onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                                        placeholder={formData.tier === "Enterprise" ? "Enter custom contract price..." : "Price"}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                    />
                                </div>
                                <div className="space-y-1 mt-4">
                                    <label className="text-xs font-bold text-[var(--text-muted)]">Payment Schedule</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentStructure: "twice" })}
                                            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                                                formData.paymentStructure === "twice"
                                                    ? 'bg-orange/10 border-orange text-orange'
                                                    : 'bg-[var(--surface-elevated)] border-transparent text-[var(--text-muted)] hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                                            }`}
                                        >
                                            <span className="text-xs font-bold mb-1">Split Payment (50/50)</span>
                                            <span className="text-[10px] opacity-60">50% upfront deposit, 50% before final handoff.</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentStructure: "once" })}
                                            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                                                formData.paymentStructure === "once"
                                                    ? 'bg-orange/10 border-orange text-orange'
                                                    : 'bg-[var(--surface-elevated)] border-transparent text-[var(--text-muted)] hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                                            }`}
                                        >
                                            <span className="text-xs font-bold mb-1">Full Upfront (100%)</span>
                                            <span className="text-[10px] opacity-60">100% full payment due after proposal approval.</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl bg-orange text-white">
                                    <p className="text-xs font-bold opacity-80 mb-2">Final Confirmation</p>
                                    <p className="text-xl font-display">Onboarding <u>{formData.clientName}</u> for project <u>{formData.projectName}</u> into <u>{formData.tier}</u> tier. Project will begin in <b>Discovery</b>.</p>
                                    <p className="text-xs font-bold opacity-90 mt-4">
                                        Payment Terms: {formData.paymentStructure === "once" ? "100% Full Upfront" : "50/50 Split (Deposit + Final)"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.autoRenew}
                                        onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                                        className="rounded border-[var(--border-color)] text-orange focus:ring-orange bg-[var(--surface-elevated)]"
                                    />
                                    <span className="text-xs text-[var(--text-secondary)]">Enable automatic studio retainer renewal</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : handleModalClose()}
                            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        >
                            {step === 1 ? "Cancel" : "Back"}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNextStep}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20 cursor-pointer"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Initializing..." : "Launch Project"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
