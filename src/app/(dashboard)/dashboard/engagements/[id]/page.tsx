"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser,
    FiTarget,
    FiFeather,
    FiCpu,
    FiCheckCircle,
    FiChevronLeft,
    FiSettings,
    FiShield,
    FiZap
} from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { Engagement, EngagementPhase } from "@/lib/types/dashboard";
import PhaseRoomEditor from "@/components/dashboard/PhaseRoomEditor";

export default function EngagementDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"neutral" | "advisory">("neutral");

    useEffect(() => {
        if (!id) return;

        const unsubscribe = onSnapshot(doc(db, "engagements", id as string), (snapshot) => {
            if (snapshot.exists()) {
                setEngagement({ id: snapshot.id, ...snapshot.data() } as Engagement);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center p-20 animate-pulse">
            <div className="h-40 bg-gray-50 dark:bg-black w-full rounded-3xl" />
        </div>
    );

    if (!engagement) return (
        <div className="text-center p-20">
            <p className="text-[var(--text-muted)]">Room not found.</p>
            <button onClick={() => router.push("/dashboard/engagements")} className="text-orange mt-4">Back to Engagements</button>
        </div>
    );

    const phases: { label: EngagementPhase, icon: any }[] = [
        { label: "Strategy", icon: FiTarget },
        { label: "Design", icon: FiFeather },
        { label: "Systems", icon: FiCpu },
        { label: "Execution", icon: FiCheckCircle },
    ];

    return (
        <div className={`transition-all duration-700 ${mode === 'advisory' ? 'advisory-room' : 'neutral-room'}`}>
            {/* Header / Room Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => router.push("/dashboard/engagements")}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] hover:text-orange transition-colors mb-4"
                    >
                        <FiChevronLeft />
                        Exit Studio Room
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${mode === 'advisory' ? 'bg-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)]'
                            }`}>
                            {mode === 'advisory' ? 'Advisory Active' : 'Neutral Mode'}
                        </span>
                        <span className="text-sm font-bold text-[var(--text-secondary)]">/</span>
                        <span className="text-sm font-bold text-[var(--text-secondary)]">{engagement.clientName}</span>
                    </div>
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)]">
                        {engagement.phase} Phase
                    </h1>
                </div>

                <div className="flex bg-gray-50 dark:bg-black rounded-2xl p-1 border border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setMode("neutral")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'neutral'
                            ? 'bg-white dark:bg-lil-black text-[var(--text-primary)] shadow-sm border border-gray-100 dark:border-gray-800'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <FiShield size={14} />
                        Neutral
                    </button>
                    <button
                        onClick={() => setMode("advisory")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'advisory'
                            ? 'bg-orange text-white shadow-xl shadow-orange/20'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <FiZap size={14} />
                        Advisory
                    </button>
                </div>
            </div>

            {/* Phase Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {phases.map((p) => {
                    const isActive = engagement.phase === p.label;
                    const Icon = p.icon;
                    return (
                        <div
                            key={p.label}
                            className={`p-6 rounded-2xl border transition-all ${isActive
                                ? 'bg-orange/5 border-orange/20 text-orange shadow-lg shadow-orange/5'
                                : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-[var(--text-muted)] opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Icon size={24} />
                                {isActive && <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{p.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Room Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PhaseRoomEditor engagementId={engagement.id} phaseType={engagement.phase} />
                </div>

                <div className="space-y-8">
                    {/* Engagement Metadata */}
                    <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">Engagement Metadata</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-3">Engagement Tier</p>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-lil-black border border-gray-100 dark:border-gray-800">
                                    <span className="text-sm font-bold text-orange">{engagement.tier}</span>
                                    <button className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-orange">Manage</button>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Project Revenue</p>
                                <p className="text-sm font-bold text-[var(--text-primary)]">₦{engagement.revenue?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Auto-Renew</p>
                                <p className={`text-sm font-bold ${engagement.autoRenew ? 'text-green' : 'text-red-500'}`}>
                                    {engagement.autoRenew ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                        </div>
                        <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-8" />
                        <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-lil-black text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-orange transition-all">
                            Manage Engagement
                        </button>
                    </div>

                    {/* Quick Access */}
                    <div className="p-8 rounded-3xl bg-lil-black text-white">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Studio Files</h3>
                        <div className="space-y-4">
                            {['Brand Strategy.pdf', 'Logo-Master.svg', 'Styleguide.fig'].map((file, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black hover:bg-orange transition-colors cursor-pointer group">
                                    <div className="w-8 h-8 rounded-lg bg-lil-black flex items-center justify-center text-[var(--text-muted)] group-hover:text-white">
                                        <FiFeather size={14} />
                                    </div>
                                    <span className="text-xs font-medium">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .advisory-room {
                    --text-primary: #F23F03;
                }
            `}</style>
        </div>
    );
}
