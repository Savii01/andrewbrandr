"use client";

import { motion } from "framer-motion";
import { usePendingBriefs } from "@/lib/hooks/useDashboardData";
import { useState } from "react";
import { FiCheck, FiX, FiClock, FiFileText, FiMessageSquare } from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import Link from "next/link";

export default function BriefsPage() {
    const { briefs, loading } = usePendingBriefs();
    const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleAcceptBrief = async (brief: any) => {
        if (!confirm("Accept this brief and create a new project engagement?")) return;
        setIsConverting(true);
        try {
            // 1. Create a new Engagement
            await addDoc(collection(db, "engagements"), {
                clientName: brief.lead?.fullName || brief.brief?.businessName || "New Client",
                tier: brief.plan === "enterprise" ? "Enterprise" :
                    brief.plan === "scale" ? "Scale" :
                        brief.plan === "clarity" ? "Clarity" : "Foundation",
                phase: "Strategy",
                progress: 0,
                status: "active",
                createdAt: new Date(),
                briefRef: brief.id,
                retainer: brief.retainer || false,
                paymentStatus: brief.paymentStatus || "pending",
                paymentRef: brief.paymentRef || "",
                contact: brief.lead || {}
            });

            // 2. Mark brief as accepted
            await updateDoc(doc(db, "briefs", brief.id), {
                status: "accepted",
                acceptedAt: new Date()
            });

            setSelectedBrief(null);
        } catch (error) {
            console.error("Error accepting brief:", error);
            alert("Failed to accept brief.");
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
            <div className={`flex-1 transition-all ${selectedBrief ? 'md:w-1/2 lg:w-1/3 block' : 'w-full block'}`}>
                <div className="mb-8">
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Briefs Inbox
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Review incoming client onboarding submissions and convert them to active engagements.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] animate-pulse" />
                        ))}
                    </div>
                ) : briefs.length > 0 ? (
                    <div className="space-y-4">
                        {briefs.map((brief) => (
                            <motion.div
                                key={brief.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedBrief(brief)}
                                className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedBrief?.id === brief.id
                                        ? "border-orange bg-orange/5"
                                        : "border-[var(--border-color)] bg-[var(--surface)] hover:border-orange/30"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-orange/10 text-orange">
                                            <FiFileText size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)] text-sm">
                                                {brief.brief?.businessName || "Unnamed Business"}
                                            </h3>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {brief.lead?.fullName || "No Name Provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-orange px-2 py-1 bg-orange/10 rounded-full">
                                        New
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                                    <span className="flex items-center gap-1">
                                        <FiClock size={12} />
                                        {brief.createdAt?.toLocaleDateString() || "Unknown Data"}
                                    </span>
                                    <span className="text-sm font-bold">
                                        {brief.plan} Plan
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface)]">
                        <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
                            <FiCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Inbox Zero</h3>
                        <p className="text-sm text-[var(--text-secondary)]">You have reviewed all incoming briefs.</p>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {selectedBrief && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-[1.5] bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 lg:p-8 sticky top-8 h-fit"
                >
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-color)]">
                        <h2 className="text-2xl font-display text-[var(--text-primary)]">Brief Details</h2>
                        <button
                            onClick={() => setSelectedBrief(null)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--surface-elevated)]"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                        {/* Client Info */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Client Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Name</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm">{selectedBrief.lead?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm">{selectedBrief.lead?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Currency</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm uppercase">{selectedBrief.lead?.currency}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Channel Contact</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm flex items-center gap-2">
                                        <FiMessageSquare size={12} className="text-orange" />
                                        {selectedBrief.lead?.whatsapp || selectedBrief.lead?.telegram || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Order Info */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Order Summary</h3>
                            <div className="bg-[var(--surface-elevated)] rounded-xl p-4 border border-[var(--border-color)]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Plan Selected</span>
                                    <span className="text-sm font-bold text-[var(--text-primary)] capitalize">{selectedBrief.plan}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Retainer Opt-in</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedBrief.retainer ? 'bg-green/10 text-green-500' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                                        {selectedBrief.retainer ? "YES" : "NO"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-[var(--border-color)]">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Payment Status</span>
                                    <span className="text-sm font-bold capitalize text-orange">{selectedBrief.paymentStatus || "pending"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Brief Answers (Dynamic based on fields present) */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Project Brief</h3>
                            <div className="space-y-4">
                                {Object.keys(selectedBrief.brief || {}).map((key) => {
                                    const value = selectedBrief.brief[key];
                                    if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                    // Format camelCase keys to readable labels
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                    return (
                                        <div key={key}>
                                            <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex gap-4">
                        <button
                            onClick={() => handleAcceptBrief(selectedBrief)}
                            disabled={isConverting}
                            className="flex-1 bg-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-light transition-all disabled:opacity-50 text-sm"
                        >
                            {isConverting ? "Converting..." : "Accept & Create Project"}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
