"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLayers, FiCheckCircle, FiPlus } from "react-icons/fi";
import { createEngagement, createClient } from "@/lib/firebase/engagements";
import { EngagementTier, EngagementPhase } from "@/lib/types/dashboard";

export default function NewEngagementModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        industry: "",
        tier: "Growth" as EngagementTier,
        phase: "Strategy" as EngagementPhase,
        revenue: 2500,
        autoRenew: false,
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create client first
            const clientId = await createClient({
                name: formData.clientName,
                email: formData.clientEmail,
                industry: formData.industry,
            });

            // 2. Create engagement linked to client
            await createEngagement({
                clientId,
                clientName: formData.clientName,
                tier: formData.tier,
                phase: formData.phase,
                status: "active",
                progress: 0,
                autoRenew: formData.autoRenew,
                revenue: Number(formData.revenue),
            });

            onClose();
            setStep(1);
        } catch (error) {
            console.error("Error creating engagement:", error);
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
                className="relative w-full max-w-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Form Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-lil-black/50">
                    <div className="flex items-center gap-3 text-orange mb-2">
                        <FiPlus size={20} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Initiate Engagement</span>
                    </div>
                    <h2 className="text-2xl font-display text-[var(--text-primary)]">New Studio Project</h2>
                </div>

                {/* Form Progress */}
                <div className="flex h-1 bg-gray-100 dark:bg-gray-900">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="bg-orange h-full"
                    />
                </div>

                <div className="p-8">
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
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Name</label>
                                        <input
                                            type="text"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-lil-black border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Industry</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-lil-black border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Tech Services"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Email</label>
                                    <input
                                        type="email"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-lil-black border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        placeholder="primary@contact.com"
                                    />
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
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Engagement Tier</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Starter", "Growth", "Premium"].map((tier) => (
                                            <button
                                                key={tier}
                                                onClick={() => setFormData({ ...formData, tier: tier as EngagementTier })}
                                                className={`p-3 rounded-xl text-xs font-bold border transition-all ${formData.tier === tier
                                                        ? 'bg-orange/10 border-orange text-orange'
                                                        : 'bg-gray-50 dark:bg-lil-black border-transparent text-[var(--text-muted)] hover:border-gray-200 dark:hover:border-gray-800'
                                                    }`}
                                            >
                                                {tier}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Contract Value (₦)</label>
                                    <input
                                        type="number"
                                        value={formData.revenue}
                                        onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                                        className="w-full bg-gray-50 dark:bg-lil-black border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
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
                                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Final Confirmation</p>
                                    <p className="text-xl font-display">Onboarding <u>{formData.clientName}</u> into <u>{formData.tier}</u> tier engagement starting in <u>{formData.phase}</u> phase.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.autoRenew}
                                        onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                                        className="rounded border-gray-300 text-orange focus:ring-orange bg-gray-50 dark:bg-lil-black"
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
                            className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {step === 1 ? "Cancel" : "Back"}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20 disabled:opacity-50"
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
