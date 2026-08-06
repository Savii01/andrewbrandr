import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";

interface HeroFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function HeroForm({ initialData, onSave, saving }: HeroFormProps) {
    const [formData, setFormData] = useState({
        name: "Andrew",
        role: "Brand Strategist & Designer",
        headline: "Your brand is the first conversation your business has with a stranger, and if it’s unclear, they move on.",
        description: "I build structured brand systems for businesses that need more than good visuals. They need clarity, consistency, and a foundation that can grow.\n\nStrategy. Identity. Web.",
        ctaText: "Start the Process",
        ctaLink: "/work-with-me"
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Hero Section</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage the primary introduction on your landing page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Role</label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Headline</label>
                <textarea
                    rows={3}
                    value={formData.headline}
                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Description (Supports new lines)</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">CTA Button Text</label>
                    <input
                        type="text"
                        value={formData.ctaText}
                        onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">CTA Button Link</label>
                    <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/20 disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {saving ? "Publishing..." : "Publish Changes"}
                </button>
            </div>
        </form>
    );
}
