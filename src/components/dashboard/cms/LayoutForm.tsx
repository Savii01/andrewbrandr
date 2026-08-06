import { useState, useEffect } from "react";
import { FiSave, FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiPlus, FiTrash2 } from "react-icons/fi";

interface LayoutFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

const DEFAULT_SECTIONS = [
    { key: "hero", label: "Hero Banner" },
    { key: "socialProofs", label: "Social Proof Logos" },
    { key: "theShift", label: "The Shift Stats" },
    { key: "processes", label: "Processes (Weekly Sprints)" },
    { key: "projectSlider", label: "Portfolio Project Slider" },
    { key: "pricing", label: "Pricing Stages & Tiers" },
    { key: "about", label: "About Savior Andrew" },
    { key: "testimonials", label: "Client Wall of Love" },
    { key: "faq", label: "Frequently Asked Questions" }
];

export default function LayoutForm({ initialData, onSave, saving }: LayoutFormProps) {
    const [formData, setFormData] = useState({
        order: [] as string[],
        visible: {} as Record<string, boolean>,
        customSections: [] as any[]
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                order: initialData.order || DEFAULT_SECTIONS.map(s => s.key),
                visible: initialData.visible || DEFAULT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {}),
                customSections: initialData.customSections || []
            }));
        } else {
            setFormData({
                order: DEFAULT_SECTIONS.map(s => s.key),
                visible: DEFAULT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {}),
                customSections: []
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Reorder sections
    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...formData.order];
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIdx < 0 || targetIdx >= newOrder.length) return;
        
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIdx];
        newOrder[targetIdx] = temp;
        
        setFormData(prev => ({ ...prev, order: newOrder }));
    };

    // Toggle visibility
    const toggleVisibility = (key: string) => {
        setFormData(prev => ({
            ...prev,
            visible: {
                ...prev.visible,
                [key]: !prev.visible[key]
            }
        }));
    };

    // Custom sections CRUD
    const addCustomSection = () => {
        const nextId = `custom-${formData.customSections.length + 1}`;
        const newSection = {
            id: nextId,
            heading: "New Custom Section",
            description: "Customize this section's description copy in the dashboard.",
            ctaText: "Start a Project",
            ctaLink: "/work-with-me",
            bgClass: "bg-white dark:bg-black"
        };

        setFormData(prev => ({
            ...prev,
            order: [...prev.order, nextId],
            visible: { ...prev.visible, [nextId]: true },
            customSections: [...prev.customSections, newSection]
        }));
    };

    const updateCustomSectionField = (index: number, field: string, value: string) => {
        const updated = [...formData.customSections];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, customSections: updated }));
    };

    const removeCustomSection = (index: number, id: string) => {
        if (!confirm("Are you sure you want to delete this custom landing page section?")) return;
        const updatedCustom = formData.customSections.filter((_, i) => i !== index);
        const updatedOrder = formData.order.filter(key => key !== id);
        
        const updatedVisible = { ...formData.visible };
        delete updatedVisible[id];

        setFormData(prev => ({
            ...prev,
            customSections: updatedCustom,
            order: updatedOrder,
            visible: updatedVisible
        }));
    };

    const getSectionLabel = (key: string) => {
        const matched = DEFAULT_SECTIONS.find(s => s.key === key);
        if (matched) return matched.label;
        
        const customMatched = formData.customSections.find(s => s.id === key);
        if (customMatched) return `Custom: ${customMatched.heading}`;
        
        return key;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Page Layout & Custom Sections</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage the vertical stack, visibility of sections, and add new text widgets.</p>
            </div>

            {/* Layout Order Stack */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Vertical Order & Visibility</label>
                    <button
                        type="button"
                        onClick={addCustomSection}
                        className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                    >
                        <FiPlus /> Add Custom Content Section
                    </button>
                </div>

                <div className="space-y-2 max-w-2xl">
                    {formData.order.map((key, idx) => {
                        const isVisible = formData.visible[key] !== false;
                        return (
                            <div
                                key={key}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isVisible 
                                        ? "bg-[var(--surface-elevated)] border-[var(--border-color)]" 
                                        : "bg-[var(--surface-elevated)]/50 border-[var(--border-color)]/50 opacity-60"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold px-2 py-1 bg-[var(--surface)] text-[var(--text-muted)] rounded-md">{idx + 1}</span>
                                    <span className="text-sm font-bold text-[var(--text-primary)]">{getSectionLabel(key)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(key)}
                                        className="p-2 text-[var(--text-muted)] hover:text-orange transition-colors"
                                        title={isVisible ? "Hide Section" : "Show Section"}
                                    >
                                        {isVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => moveSection(idx, 'up')}
                                        className="p-2 text-[var(--text-muted)] hover:text-orange disabled:opacity-30 transition-colors"
                                        title="Move Up"
                                    >
                                        <FiArrowUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === formData.order.length - 1}
                                        onClick={() => moveSection(idx, 'down')}
                                        className="p-2 text-[var(--text-muted)] hover:text-orange disabled:opacity-30 transition-colors"
                                        title="Move Down"
                                    >
                                        <FiArrowDown size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Content Sections CRUD */}
            {formData.customSections.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase block">Edit Custom Landing Page Sections</label>
                    <div className="space-y-6">
                        {formData.customSections.map((sec, idx) => (
                            <div key={sec.id || idx} className="p-6 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-2xl space-y-4 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeCustomSection(idx, sec.id)}
                                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Custom Section"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Section ID (slug)</span>
                                        <input
                                            type="text"
                                            disabled
                                            value={sec.id}
                                            className="w-full bg-[var(--surface)] opacity-50 border-none rounded-lg p-2 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Section Heading Title</span>
                                        <input
                                            type="text"
                                            value={sec.heading}
                                            onChange={e => updateCustomSectionField(idx, "heading", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Section Description Paragraphs</span>
                                        <textarea
                                            rows={3}
                                            value={sec.description}
                                            onChange={e => updateCustomSectionField(idx, "description", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-orange resize-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CTA Button Text (Optional)</span>
                                        <input
                                            type="text"
                                            value={sec.ctaText || ""}
                                            onChange={e => updateCustomSectionField(idx, "ctaText", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CTA Button Link (Optional)</span>
                                        <input
                                            type="text"
                                            value={sec.ctaLink || ""}
                                            onChange={e => updateCustomSectionField(idx, "ctaLink", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Styling background Class (Tailwind/CSS)</span>
                                        <input
                                            type="text"
                                            value={sec.bgClass || ""}
                                            onChange={e => updateCustomSectionField(idx, "bgClass", e.target.value)}
                                            placeholder="e.g. bg-white dark:bg-black"
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/20 disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {saving ? "Publishing..." : "Publish Layout Changes"}
                </button>
            </div>
        </form>
    );
}
