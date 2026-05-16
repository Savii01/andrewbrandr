"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function SettingsPage() {
    const [status, setStatus] = useState<"available" | "unavailable">("available");
    const [slots, setSlots] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "settings", "availability"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setStatus(data.status || "available");
                setSlots(typeof data.slots === "number" ? data.slots : 0);
            }
        });
        return () => unsub();
    }, []);

    const handleSaveAvailability = async (newStatus: "available" | "unavailable", newSlots: number) => {
        setSaving(true);
        setStatus(newStatus);
        setSlots(newSlots);
        try {
            await setDoc(doc(db, "settings", "availability"), {
                status: newStatus,
                slots: newSlots
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save availability:", error);
        }
        setSaving(false);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-1">
                    Settings
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Configure your Brand Studio
                </p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Firebase Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-6"
                >
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Integrations
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                        Firebase, Paystack, email, and messaging integrations will be configured here.
                    </p>
                </motion.div>
                {/* Availability Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-6"
                >
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                        Availability Control
                        {saving && <span className="text-xs text-orange animate-pulse">Saving...</span>}
                    </h2>

                    <div className="flex flex-col gap-6">
                        {/* Status Toggle */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-(--text-secondary) font-medium">Status</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSaveAvailability("available", slots)}
                                    className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${status === "available"
                                            ? "border-green bg-green/10 text-green"
                                            : "border-gray-200 dark:border-gray-800 text-[var(--text-secondary)] hover:border-gray-400"
                                        }`}
                                >
                                    Taking Projects
                                </button>
                                <button
                                    onClick={() => handleSaveAvailability("unavailable", slots)}
                                    className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${status === "unavailable"
                                            ? "border-red-500 bg-red-500/10 text-red-500"
                                            : "border-gray-200 dark:border-gray-800 text-[var(--text-secondary)] hover:border-gray-400"
                                        }`}
                                >
                                    Fully Booked
                                </button>
                            </div>
                        </div>

                        {/* Slots Control */}
                        {status === "available" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-[var(--text-secondary)] font-medium">Remaining Slots (0 = Unlimited Profile view)</label>
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => handleSaveAvailability(status, Math.max(0, slots - 1))}
                                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="font-mono text-lg w-8 text-center">{slots}</span>
                                    <button
                                        onClick={() => handleSaveAvailability(status, slots + 1)}
                                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
