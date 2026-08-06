import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";

interface TheShiftFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function TheShiftForm({ initialData, onSave, saving }: TheShiftFormProps) {
    const [formData, setFormData] = useState({
        paragraphs: "Brands aren’t built in pieces.\n\nFor years, businesses hired designers one task at a time.\n\nA logo here. A flyer there. A website later.\n\nIt works for a moment. But growth exposes the cracks. Inconsistency. Mixed messaging. A brand that doesn’t feel whole.\n\nSo I stopped offering services individually.\n\nNow everything is built in stages. Each stage meets your business where it is and prepares it for where it’s going.\n\nNo fragmentation. No guesswork. Just structure."
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
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">The Shift Section</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage the manifesto text. Separate paragraphs with double newlines.</p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Manifesto Text</label>
                <textarea
                    rows={15}
                    value={formData.paragraphs}
                    onChange={e => setFormData({ ...formData, paragraphs: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none leading-relaxed"
                />
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
