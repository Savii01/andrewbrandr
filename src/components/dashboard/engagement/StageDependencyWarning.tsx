"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiChevronRight, FiX } from "react-icons/fi";

interface StageDependencyWarningProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
    targetStageLabel: string;
    incompleteDependencies: string[];
}

export default function StageDependencyWarning({
    isOpen,
    onClose,
    onProceed,
    targetStageLabel,
    incompleteDependencies
}: StageDependencyWarningProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl p-8"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-colors"
                >
                    <FiX size={18} />
                </button>

                <div className="flex items-center gap-4 text-orange mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center">
                        <FiAlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-orange opacity-80">Studio Intelligence</p>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Incomplete Prerequisites</h2>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        You are about to activate the <span className="font-bold text-[var(--text-primary)]">{targetStageLabel}</span> stage, but the following dependencies are still marked as incomplete:
                    </p>

                    <div className="space-y-2">
                        {incompleteDependencies.map((dep) => (
                            <div key={dep} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                                <div className="w-2 h-2 rounded-full bg-orange/40" />
                                <span className="text-xs font-bold text-[var(--text-primary)]">{dep}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-orange/5 border border-orange/10">
                        <p className="text-xs text-orange font-bold leading-relaxed">
                            Note: Activation is permitted, but ensure that any critical strategy or commercial alignment from these stages has been resolved.
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                    <button
                        onClick={() => {
                            onProceed();
                            onClose();
                        }}
                        className="w-full py-4 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/20 flex items-center justify-center gap-2"
                    >
                        Proceed to Activation
                        <FiChevronRight size={14} />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Return to Workspace
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
