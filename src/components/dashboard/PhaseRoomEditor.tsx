"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiLayout, FiSave, FiEye } from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

interface PhaseData {
    engagementId: string;
    phaseType: string;
    mode: "template" | "editor";
    content: string;
}

export default function PhaseRoomEditor({
    engagementId,
    phaseType
}: {
    engagementId: string;
    phaseType: string
}) {
    const phaseId = `${engagementId}_${phaseType.toLowerCase()}`;
    const [phase, setPhase] = useState<PhaseData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localContent, setLocalContent] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "phases", phaseId), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as PhaseData;
                setPhase(data);
                setLocalContent(data.content);
            }
        });

        return () => unsubscribe();
    }, [phaseId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, "phases", phaseId), {
                content: localContent,
                updatedAt: serverTimestamp(),
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving phase:", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleMode = async () => {
        if (!phase) return;
        const newMode = phase.mode === "template" ? "editor" : "template";
        await updateDoc(doc(db, "phases", phaseId), {
            mode: newMode,
        });
    };

    if (!phase) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-50 dark:bg-black rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                    <button
                        onClick={toggleMode}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${phase.mode === 'template'
                            ? 'bg-white dark:bg-lil-black text-orange border border-gray-100 dark:border-gray-800 shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-orange'
                            }`}
                    >
                        <FiLayout size={12} />
                        Structured
                    </button>
                    <button
                        onClick={toggleMode}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${phase.mode === 'editor'
                            ? 'bg-white dark:bg-lil-black text-orange border border-gray-100 dark:border-gray-800 shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-orange'
                            }`}
                    >
                        <FiEdit3 size={12} />
                        Free Block
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-orange text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/10 disabled:opacity-50"
                        >
                            <FiSave size={14} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-gray-50 dark:bg-lil-black text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 transition-all"
                        >
                            <FiEdit3 size={14} />
                            Edit Room
                        </button>
                    )}
                </div>
            </div>

            <div className={`min-h-[500px] rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black overflow-hidden transition-all ${isEditing ? 'ring-2 ring-orange/10' : ''}`}>
                {isEditing ? (
                    <textarea
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                        className="w-full h-full min-h-[500px] p-10 bg-transparent border-none text-[var(--text-primary)] font-mono text-sm leading-relaxed focus:ring-0 placeholder:text-[var(--text-muted)]"
                        placeholder={`Begin defining the ${phaseType} for this engagement...`}
                    />
                ) : (
                    <div className="p-10 prose dark:prose-invert max-w-none">
                        {localContent ? (
                            <div className="whitespace-pre-wrap text-[var(--text-primary)] leading-relaxed font-sans text-sm">
                                {localContent}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 text-center text-[var(--text-muted)]">
                                <FiEye size={40} className="mb-4 opacity-20" />
                                <p className="text-sm">This room is empty. Use the Edit tool to begin defining the phase scope.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
