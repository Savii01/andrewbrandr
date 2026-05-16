"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLayers, FiCheckCircle, FiPlus, FiAlertCircle } from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { createEngagement, createClient } from "@/lib/firebase/engagements";
import { EngagementTier } from "@/lib/types/dashboard";

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
        revenue: 2500,
        autoRenew: false,
    });

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

                    await createEngagement({
                        clientIds: [clientId],
                        projectName: formData.projectName || `${formData.clientName} Brand Project`,
                        tier: formData.tier,
                    });
                })(),
                timeout
            ]);

            onClose();
            setStep(1);
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
                onClick={onClose}
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
                                        {["Foundation", "Clarity", "Scale", "Enterprise"].map((tier) => (
                                            <button
                                                key={tier}
                                                onClick={() => setFormData({ ...formData, tier: tier as EngagementTier })}
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
                                    <label className="text-xs font-bold text-[var(--text-muted)]">Contract Value (₦)</label>
                                    <input
                                        type="number"
                                        value={formData.revenue}
                                        onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                    />
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
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {step === 1 ? "Cancel" : "Back"}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20 disabled:opacity-50"
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
