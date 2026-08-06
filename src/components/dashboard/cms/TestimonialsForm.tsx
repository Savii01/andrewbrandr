import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";

interface TestimonialsFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function TestimonialsForm({ initialData, onSave, saving }: TestimonialsFormProps) {
    const [formData, setFormData] = useState({
        heading: "Why Clients Love Us",
        subheading: "Trusted by creators and businesses worldwide. Here is what they have to say.",
        list: [] as any[]
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                heading: initialData.heading || prev.heading,
                subheading: initialData.subheading || prev.subheading,
                list: initialData.list || []
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const addTestimonial = () => {
        const nextId = formData.list.length > 0 ? Math.max(...formData.list.map((t: any) => t.id)) + 1 : 1;
        setFormData(prev => ({
            ...prev,
            list: [...prev.list, { id: nextId, name: "Client Name", businessName: "Company Name", review: "Draft client testimonial review text." }]
        }));
    };

    const updateTestimonial = (index: number, field: string, value: string) => {
        const newList = [...formData.list];
        newList[index] = { ...newList[index], [field]: value };
        setFormData(prev => ({ ...prev, list: newList }));
    };

    const removeTestimonial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            list: prev.list.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Testimonials</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage the Wall of Love reviews, headings, and client identities.</p>
            </div>

            <div className="space-y-4 bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Testimonials Headers</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Section Heading</label>
                        <input
                            type="text"
                            value={formData.heading}
                            onChange={e => setFormData({ ...formData, heading: e.target.value })}
                            className="w-full bg-[var(--surface)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Subheading Description</label>
                        <input
                            type="text"
                            value={formData.subheading}
                            onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                            className="w-full bg-[var(--surface)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                        />
                    </div>
                </div>
            </div>

            {/* Testimonials List Manager */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Client Reviews List</label>
                    <button
                        type="button"
                        onClick={addTestimonial}
                        className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                    >
                        <FiPlus /> Add Review
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.list.map((item, idx) => (
                        <div key={item.id || idx} className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] space-y-4 relative group">
                            <button
                                type="button"
                                onClick={() => removeTestimonial(idx)}
                                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove testimonial"
                            >
                                <FiTrash2 size={16} />
                            </button>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Client Name</span>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={e => updateTestimonial(idx, "name", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Business / Company</span>
                                        <input
                                            type="text"
                                            value={item.businessName}
                                            onChange={e => updateTestimonial(idx, "businessName", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Review Body</span>
                                    <textarea
                                        rows={3}
                                        value={item.review}
                                        onChange={e => updateTestimonial(idx, "review", e.target.value)}
                                        className="w-full bg-[var(--surface)] border-none rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-orange resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {formData.list.length === 0 && (
                        <p className="text-xs text-[var(--text-muted)] italic col-span-2 text-center py-6 bg-[var(--surface-elevated)] border border-dashed rounded-xl">No reviews added yet.</p>
                    )}
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
