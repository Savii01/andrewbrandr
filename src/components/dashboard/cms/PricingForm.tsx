import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface PricingFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function PricingForm({ initialData, onSave, saving }: PricingFormProps) {
    const [formData, setFormData] = useState({
        heading: "Growth happens in phases.\nYour brand should reflect the one you're in.",
        investmentHeading: "A strong brand is not an expense.",
        investmentText: "It's the foundation your growth depends on. Each stage is designed around what your business actually needs.",
        plans: [] as any[]
    });

    const [activePlanIdx, setActivePlanIdx] = useState<number | null>(0);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                heading: initialData.heading || prev.heading,
                investmentHeading: initialData.investmentHeading || prev.investmentHeading,
                investmentText: initialData.investmentText || prev.investmentText,
                plans: initialData.plans || []
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const addPlan = () => {
        const nextId = formData.plans.length > 0 ? Math.max(...formData.plans.map((p: any) => p.id)) + 1 : 1;
        const newPlan = {
            id: nextId,
            slug: `stage-new-${nextId}`,
            title: `Stage 0${nextId} — New Stage`,
            subtitle: "Stage Subtitle",
            description: "Stage description goes here.",
            priceNGN: "₦0",
            priceUSD: "$0",
            highlights: ["First brand highlight"],
            sections: [
                {
                    title: "What you walk away with",
                    items: ["Key takeaway or item"]
                }
            ],
            retainer: {
                title: "Social Media Retainer",
                priceNGN: "₦0/month",
                priceUSD: "$0/month",
                items: ["Item 1"]
            },
            buttonText: "Start a Project",
            buttonLink: `/work-with-me?plan=stage-new-${nextId}`,
            footerText: "Strategy & Design"
        };

        setFormData(prev => ({
            ...prev,
            plans: [...prev.plans, newPlan]
        }));
        setActivePlanIdx(formData.plans.length);
    };

    const deletePlan = (index: number) => {
        if (!confirm("Are you sure you want to delete this pricing stage plan?")) return;
        const updatedPlans = formData.plans.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, plans: updatedPlans }));
        setActivePlanIdx(updatedPlans.length > 0 ? 0 : null);
    };

    const updatePlanField = (planIdx: number, field: string, value: any) => {
        const updatedPlans = [...formData.plans];
        updatedPlans[planIdx] = { ...updatedPlans[planIdx], [field]: value };
        setFormData(prev => ({ ...prev, plans: updatedPlans }));
    };

    // Helper functions for Highlights CRUD
    const addHighlight = (planIdx: number) => {
        const plan = formData.plans[planIdx];
        updatePlanField(planIdx, "highlights", [...(plan.highlights || []), "New Highlight Line"]);
    };

    const updateHighlight = (planIdx: number, highlightIdx: number, value: string) => {
        const plan = formData.plans[planIdx];
        const newHighlights = [...(plan.highlights || [])];
        newHighlights[highlightIdx] = value;
        updatePlanField(planIdx, "highlights", newHighlights);
    };

    const removeHighlight = (planIdx: number, highlightIdx: number) => {
        const plan = formData.plans[planIdx];
        const newHighlights = (plan.highlights || []).filter((_: any, i: number) => i !== highlightIdx);
        updatePlanField(planIdx, "highlights", newHighlights);
    };

    // Helper functions for Sections CRUD
    const addSection = (planIdx: number) => {
        const plan = formData.plans[planIdx];
        updatePlanField(planIdx, "sections", [...(plan.sections || []), { title: "New Section Title", items: ["New Item"] }]);
    };

    const updateSectionTitle = (planIdx: number, sectionIdx: number, title: string) => {
        const plan = formData.plans[planIdx];
        const newSections = [...(plan.sections || [])];
        newSections[sectionIdx] = { ...newSections[sectionIdx], title };
        updatePlanField(planIdx, "sections", newSections);
    };

    const removeSection = (planIdx: number, sectionIdx: number) => {
        const plan = formData.plans[planIdx];
        const newSections = (plan.sections || []).filter((_: any, i: number) => i !== sectionIdx);
        updatePlanField(planIdx, "sections", newSections);
    };

    const addSectionItem = (planIdx: number, sectionIdx: number) => {
        const plan = formData.plans[planIdx];
        const newSections = [...(plan.sections || [])];
        newSections[sectionIdx] = {
            ...newSections[sectionIdx],
            items: [...(newSections[sectionIdx].items || []), "New checklist item"]
        };
        updatePlanField(planIdx, "sections", newSections);
    };

    const updateSectionItemText = (planIdx: number, sectionIdx: number, itemIdx: number, text: string) => {
        const plan = formData.plans[planIdx];
        const newSections = [...(plan.sections || [])];
        const newItems = [...(newSections[sectionIdx].items || [])];
        newItems[itemIdx] = text;
        newSections[sectionIdx] = { ...newSections[sectionIdx], items: newItems };
        updatePlanField(planIdx, "sections", newSections);
    };

    const removeSectionItem = (planIdx: number, sectionIdx: number, itemIdx: number) => {
        const plan = formData.plans[planIdx];
        const newSections = [...(plan.sections || [])];
        newSections[sectionIdx] = {
            ...newSections[sectionIdx],
            items: (newSections[sectionIdx].items || []).filter((_: any, i: number) => i !== itemIdx)
        };
        updatePlanField(planIdx, "sections", newSections);
    };

    // Helper functions for Retainer Items CRUD
    const updateRetainerField = (planIdx: number, field: string, value: any) => {
        const plan = formData.plans[planIdx];
        const newRetainer = { ...(plan.retainer || { title: "", priceNGN: "", priceUSD: "", items: [] }), [field]: value };
        updatePlanField(planIdx, "retainer", newRetainer);
    };

    const addRetainerItem = (planIdx: number) => {
        const plan = formData.plans[planIdx];
        const retainer = plan.retainer || { title: "", priceNGN: "", priceUSD: "", items: [] };
        const newItems = [...(retainer.items || []), "New retainer item"];
        updateRetainerField(planIdx, "items", newItems);
    };

    const updateRetainerItemText = (planIdx: number, itemIdx: number, text: string) => {
        const plan = formData.plans[planIdx];
        const retainer = plan.retainer || { title: "", priceNGN: "", priceUSD: "", items: [] };
        const newItems = [...(retainer.items || [])];
        newItems[itemIdx] = text;
        updateRetainerField(planIdx, "items", newItems);
    };

    const removeRetainerItem = (planIdx: number, itemIdx: number) => {
        const plan = formData.plans[planIdx];
        const retainer = plan.retainer || { title: "", priceNGN: "", priceUSD: "", items: [] };
        const newItems = (retainer.items || []).filter((_: any, i: number) => i !== itemIdx);
        updateRetainerField(planIdx, "items", newItems);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Pricing & Individual Stage CRUD</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Create, read, update and delete full pricing plan properties.</p>
            </div>

            <div className="space-y-4 bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Section Headings</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Pricing Subtitle / Heading</label>
                        <textarea
                            rows={2}
                            value={formData.heading}
                            onChange={e => setFormData({ ...formData, heading: e.target.value })}
                            className="w-full bg-[var(--surface)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Investment Heading</label>
                            <input
                                type="text"
                                value={formData.investmentHeading}
                                onChange={e => setFormData({ ...formData, investmentHeading: e.target.value })}
                                className="w-full bg-[var(--surface)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Investment Supporting Text</label>
                            <input
                                type="text"
                                value={formData.investmentText}
                                onChange={e => setFormData({ ...formData, investmentText: e.target.value })}
                                className="w-full bg-[var(--surface)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Tiers & Individual Plan Editor */}
            <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[var(--text-primary)]">Service Tiers & Pricing Stages</h3>
                    <button
                        type="button"
                        onClick={addPlan}
                        className="flex items-center gap-2 px-4 py-2 bg-orange/10 hover:bg-orange/20 text-orange text-xs font-black rounded-xl transition-all"
                    >
                        <FiPlus /> Add New Stage
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Pane - List of plans */}
                    <div className="lg:col-span-1 space-y-2">
                        {formData.plans.map((plan, idx) => (
                            <div
                                key={plan.id || idx}
                                onClick={() => setActivePlanIdx(idx)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                                    activePlanIdx === idx
                                        ? "bg-orange/10 border-orange text-orange"
                                        : "bg-[var(--surface-elevated)] border-[var(--border-color)] hover:border-orange/50 text-[var(--text-primary)]"
                                }`}
                            >
                                <div className="text-left">
                                    <span className="text-xs font-bold text-[var(--text-muted)] block uppercase">{plan.slug}</span>
                                    <span className="font-bold text-sm">{plan.title || "Untitled Stage"}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deletePlan(idx); }}
                                    className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
                                    title="Delete plan"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {formData.plans.length === 0 && (
                            <p className="text-xs text-[var(--text-muted)] italic">No pricing plans defined yet.</p>
                        )}
                    </div>

                    {/* Right Pane - Active Plan Editor */}
                    <div className="lg:col-span-2">
                        {activePlanIdx !== null && formData.plans[activePlanIdx] ? (
                            <div className="p-6 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-2xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-base font-bold text-[var(--text-primary)]">Edit: {formData.plans[activePlanIdx].title || "Untitled"}</h4>
                                    <span className="text-xs font-bold px-2 py-1 bg-orange/15 text-orange rounded-lg uppercase">{formData.plans[activePlanIdx].slug}</span>
                                </div>

                                {/* Core fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Slug (Internal URL Key)</label>
                                        <input
                                            type="text"
                                            value={formData.plans[activePlanIdx].slug}
                                            onChange={e => updatePlanField(activePlanIdx, "slug", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title (e.g. Stage 01 — Title)</label>
                                        <input
                                            type="text"
                                            value={formData.plans[activePlanIdx].title}
                                            onChange={e => updatePlanField(activePlanIdx, "title", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Subtitle (Summary Line)</label>
                                        <input
                                            type="text"
                                            value={formData.plans[activePlanIdx].subtitle || ""}
                                            onChange={e => updatePlanField(activePlanIdx, "subtitle", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Price NGN</label>
                                        <input
                                            type="text"
                                            value={formData.plans[activePlanIdx].priceNGN}
                                            onChange={e => updatePlanField(activePlanIdx, "priceNGN", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Price USD</label>
                                        <input
                                            type="text"
                                            value={formData.plans[activePlanIdx].priceUSD}
                                            onChange={e => updatePlanField(activePlanIdx, "priceUSD", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Brief description</label>
                                        <textarea
                                            rows={2}
                                            value={formData.plans[activePlanIdx].description}
                                            onChange={e => updatePlanField(activePlanIdx, "description", e.target.value)}
                                            className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Highlights CRUD */}
                                <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Plan Highlights (Visual Badges)</label>
                                        <button
                                            type="button"
                                            onClick={() => addHighlight(activePlanIdx)}
                                            className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <FiPlus /> Add Highlight
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(formData.plans[activePlanIdx].highlights || []).map((highlight: string, hIdx: number) => (
                                            <div key={hIdx} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={highlight}
                                                    onChange={e => updateHighlight(activePlanIdx, hIdx, e.target.value)}
                                                    className="flex-1 bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeHighlight(activePlanIdx, hIdx)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deep Sections & Items CRUD */}
                                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Checklist Deliverables / Sections</label>
                                        <button
                                            type="button"
                                            onClick={() => addSection(activePlanIdx)}
                                            className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <FiPlus /> Add Section
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {(formData.plans[activePlanIdx].sections || []).map((sec: any, sIdx: number) => (
                                            <div key={sIdx} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] space-y-3">
                                                <div className="flex justify-between items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={sec.title || ""}
                                                        onChange={e => updateSectionTitle(activePlanIdx, sIdx, e.target.value)}
                                                        className="font-bold text-xs bg-[var(--surface-elevated)] border-none rounded-lg p-2 flex-1 focus:ring-1 focus:ring-orange text-[var(--text-primary)]"
                                                        placeholder="Section Title (e.g. Design)"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSection(activePlanIdx, sIdx)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        title="Remove entire section"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="space-y-2 pl-4 border-l border-orange/20">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Section bullet points</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addSectionItem(activePlanIdx, sIdx)}
                                                            className="text-[10px] text-orange font-bold flex items-center gap-0.5 hover:underline"
                                                        >
                                                            <FiPlus /> Add bullet
                                                        </button>
                                                    </div>
                                                    {(sec.items || []).map((item: string, iIdx: number) => (
                                                        <div key={iIdx} className="flex gap-2 items-start">
                                                            <textarea
                                                                rows={2}
                                                                value={item}
                                                                onChange={e => updateSectionItemText(activePlanIdx, sIdx, iIdx, e.target.value)}
                                                                className="flex-1 bg-[var(--surface-elevated)] border-none rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-orange resize-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSectionItem(activePlanIdx, sIdx, iIdx)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1 mt-1"
                                                            >
                                                                <FiTrash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Retainer Fields */}
                                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase block">Retainer Proposal</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Retainer Title</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].retainer?.title || ""}
                                                onChange={e => updateRetainerField(activePlanIdx, "title", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Retainer NGN</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].retainer?.priceNGN || ""}
                                                onChange={e => updateRetainerField(activePlanIdx, "priceNGN", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Retainer USD</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].retainer?.priceUSD || ""}
                                                onChange={e => updateRetainerField(activePlanIdx, "priceUSD", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                    </div>

                                    {/* Retainer Items */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Retainer bullets</span>
                                            <button
                                                type="button"
                                                onClick={() => addRetainerItem(activePlanIdx)}
                                                className="text-[10px] text-orange font-bold flex items-center gap-0.5 hover:underline"
                                            >
                                                <FiPlus /> Add retainer bullet
                                            </button>
                                        </div>
                                        {(formData.plans[activePlanIdx].retainer?.items || []).map((rItem: string, rIdx: number) => (
                                            <div key={rIdx} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={rItem}
                                                    onChange={e => updateRetainerItemText(activePlanIdx, rIdx, e.target.value)}
                                                    className="flex-1 bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeRetainerItem(activePlanIdx, rIdx)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Call to action & footer details */}
                                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase block">CTA & Footer Specs</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Button Text</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].buttonText || ""}
                                                onChange={e => updatePlanField(activePlanIdx, "buttonText", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Button Link</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].buttonLink || ""}
                                                onChange={e => updatePlanField(activePlanIdx, "buttonLink", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Footer Subheading</span>
                                            <input
                                                type="text"
                                                value={formData.plans[activePlanIdx].footerText || ""}
                                                onChange={e => updatePlanField(activePlanIdx, "footerText", e.target.value)}
                                                className="w-full bg-[var(--surface)] border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-orange"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-[var(--surface-elevated)] border border-dashed border-[var(--border-color)] rounded-2xl">
                                <p className="text-sm font-bold text-[var(--text-muted)]">Select or add a stage/plan from the list on the left to edit details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/20 disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {saving ? "Publishing..." : "Publish Plan Changes"}
                </button>
            </div>
        </form>
    );
}
