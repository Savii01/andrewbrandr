"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiImage, FiLink, FiCheckCircle, FiInfo, FiTag } from "react-icons/fi";
import { createProject } from "@/lib/firebase/portfolio";
import { Project } from "@/lib/types/portfolio";

export default function NewProjectModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        client: "",
        image: "",
        images: [] as string[],
        category: [] as string[],
        description: "",
        website: "",
        behance: "",
        year: new Date().getFullYear(),
        isPublic: true,
        order: 0,
        challenge: "",
        solution: ""
    });

    const [categoryInput, setCategoryInput] = useState("");

    const addCategory = () => {
        if (categoryInput && !formData.category.includes(categoryInput)) {
            setFormData({ ...formData, category: [...formData.category, categoryInput] });
            setCategoryInput("");
        }
    };

    const removeCategory = (cat: string) => {
        setFormData({ ...formData, category: formData.category.filter(c => c !== cat) });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createProject({
                ...formData,
                images: formData.image ? [formData.image, ...formData.images] : formData.images
            });
            onClose();
            setStep(1);
            // Reset form
            setFormData({
                name: "",
                client: "",
                image: "",
                images: [],
                category: [],
                description: "",
                website: "",
                behance: "",
                year: new Date().getFullYear(),
                isPublic: true,
                order: 0,
                challenge: "",
                solution: ""
            });
        } catch (error) {
            console.error("Error creating project:", error);
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
                className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Form Header */}
                <div className="p-8 border-b border-[var(--border-color)] bg-[var(--surface-elevated)]/50">
                    <div className="flex items-center gap-3 text-orange mb-2">
                        <FiPlus size={20} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Showcase Management</span>
                    </div>
                    <h2 className="text-2xl font-display text-[var(--text-primary)]">Add New Project</h2>
                </div>

                {/* Form Progress */}
                <div className="flex h-1 bg-[var(--surface-elevated)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="bg-orange h-full"
                    />
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Project Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Nexova"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client</label>
                                        <input
                                            type="text"
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Nexova Technologies"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Short Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-24 resize-none"
                                        placeholder="Summary of the project..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Year</label>
                                        <input
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Categories</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={categoryInput}
                                                onChange={(e) => setCategoryInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                                                className="flex-1 bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                                placeholder="Add tag..."
                                            />
                                            <button 
                                                onClick={addCategory}
                                                className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-orange"
                                            >
                                                <FiTag />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.category.map(cat => (
                                                <span key={cat} className="px-2 py-1 bg-orange/10 text-orange rounded-md text-[10px] font-bold flex items-center gap-1">
                                                    {cat}
                                                    <button onClick={() => removeCategory(cat)} className="hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
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
                                className="space-y-6"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Cover Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        placeholder="/images/portfolio/project.png"
                                    />
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1">Upload to public/images and paste path here.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Website Link</label>
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Behance Link</label>
                                        <input
                                            type="text"
                                            value={formData.behance}
                                            onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="https://behance.net/..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-orange/10 text-orange">
                                                <FiCheckCircle size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-primary)]">Public Visibility</p>
                                                <p className="text-[10px] text-[var(--text-muted)]">Visible on the landing page</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                                            className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublic ? 'bg-orange' : 'bg-[var(--surface)] border border-[var(--border-color)]'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublic ? 'right-1' : 'left-1'}`} />
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
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">The Challenge</label>
                                    <textarea
                                        value={formData.challenge}
                                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-32 resize-none"
                                        placeholder="What problem were we solving?"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">The Solution</label>
                                    <textarea
                                        value={formData.solution}
                                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-32 resize-none"
                                        placeholder="How did we solve it?"
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-orange/5 border border-orange/20 text-xs text-orange leading-relaxed">
                                    <FiInfo className="inline mb-1 mr-2" />
                                    This project will be added to the end of your selected work grid. You can reorder it from the management screen.
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
                                {loading ? "Publishing..." : "Publish Project"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
