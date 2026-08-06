import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";

interface FAQFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export default function FAQForm({ initialData, onSave, saving }: FAQFormProps) {
    const [formData, setFormData] = useState({
        badge: "FAQs",
        heading: "Frequently Asked Questions",
        description: "I know you might have questions, that are not in the FAQs. You can send me a message here and I will get back to you as soon as possible. 😊",
        questions: [
            { question: "What is your typical process?", answer: "We start with discovery, move to strategy, and then execute the design system." }
        ]
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

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: "", answer: "" }]
        }));
    };

    const updateQuestion = (index: number, field: string, value: string) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData({ ...formData, questions: newQuestions });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">FAQ Section</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage common questions and the contact prompt.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Section Badge</label>
                    <input
                        type="text"
                        value={formData.badge}
                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Heading</label>
                    <input
                        type="text"
                        value={formData.heading}
                        onChange={e => setFormData({ ...formData, heading: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Contact Form Description</label>
                <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Questions & Answers</label>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-1 text-xs font-bold text-orange hover:text-orange/80 transition-colors"
                    >
                        <FiPlus /> Add Question
                    </button>
                </div>
                
                {formData.questions.map((q, index) => (
                    <div key={index} className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] space-y-4 relative group">
                        <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <FiTrash2 size={16} />
                        </button>
                        <div className="space-y-2 pr-8">
                            <input
                                type="text"
                                placeholder="Question..."
                                value={q.question}
                                onChange={e => updateQuestion(index, 'question', e.target.value)}
                                className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-sm font-bold focus:ring-1 focus:ring-orange"
                            />
                        </div>
                        <div className="space-y-2 pr-8">
                            <textarea
                                rows={2}
                                placeholder="Answer..."
                                value={q.answer}
                                onChange={e => updateQuestion(index, 'answer', e.target.value)}
                                className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-sm font-bold focus:ring-1 focus:ring-orange resize-none"
                            />
                        </div>
                    </div>
                ))}
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
