import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";

interface AboutFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function AboutForm({ initialData, onSave, saving }: AboutFormProps) {
    const [formData, setFormData] = useState({
        badge: "Expert Designer",
        name: "Saviour Andrew",
        roleLine: "Visual & Brand Designer • Web Designer & Developer • Digital Designer",
        description: "I’m Saviour Andrew, a Visual & Web Designer passionate about crafting bold brand identities and digital experiences that feel thoughtful and timeless.",
        skills: [] as string[],
        experience: [] as { role: string; company: string; year: string }[]
    });

    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                badge: initialData.badge || prev.badge,
                name: initialData.name || prev.name,
                roleLine: initialData.roleLine || prev.roleLine,
                description: initialData.description || prev.description,
                skills: initialData.skills || [],
                experience: initialData.experience || []
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Skills handlers
    const addSkill = () => {
        if (!newSkill.trim()) return;
        if (formData.skills.includes(newSkill.trim())) return;
        setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
        setNewSkill("");
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    };

    // Experience CRUD handlers
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: "Designer", company: "Company", year: "2024" }]
        }));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const newExp = [...formData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const removeExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">About Me</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage your designer bio, professional experience, and skills list.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Profile Badge</label>
                    <input
                        type="text"
                        value={formData.badge}
                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Role Subtitle Line</label>
                <input
                    type="text"
                    value={formData.roleLine}
                    onChange={e => setFormData({ ...formData, roleLine: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Introduction Biography</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                />
            </div>

            {/* Skills Tags Manager */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase block">Skills / Core Focus Tags</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        placeholder="Add new skill (e.g. Next.js)"
                        className="bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange flex-1"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-6 bg-orange/10 hover:bg-orange/20 text-orange text-sm font-black rounded-xl transition-all"
                    >
                        Add Tag
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map((skill, idx) => (
                        <span
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] rounded-lg"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-[var(--text-muted)] hover:text-red-500 font-bold"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    {formData.skills.length === 0 && (
                        <p className="text-xs text-[var(--text-muted)] italic">No skills added yet.</p>
                    )}
                </div>
            </div>

            {/* Experience CRUD */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Professional Work History</label>
                    <button
                        type="button"
                        onClick={addExperience}
                        className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                    >
                        <FiPlus /> Add Record
                    </button>
                </div>

                <div className="space-y-3">
                    {formData.experience.map((exp, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-[var(--surface-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                            <input
                                type="text"
                                value={exp.role}
                                onChange={e => updateExperience(idx, "role", e.target.value)}
                                placeholder="Role (e.g. Brand Designer)"
                                className="flex-1 bg-[var(--surface)] border-none rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                            <input
                                type="text"
                                value={exp.company}
                                onChange={e => updateExperience(idx, "company", e.target.value)}
                                placeholder="Company (e.g. Google)"
                                className="flex-1 bg-[var(--surface)] border-none rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                            <input
                                type="text"
                                value={exp.year}
                                onChange={e => updateExperience(idx, "year", e.target.value)}
                                placeholder="Year (e.g. 2024)"
                                className="w-24 bg-[var(--surface)] border-none rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                            <button
                                type="button"
                                onClick={() => removeExperience(idx)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {formData.experience.length === 0 && (
                        <p className="text-xs text-[var(--text-muted)] italic">No experience history defined yet.</p>
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
