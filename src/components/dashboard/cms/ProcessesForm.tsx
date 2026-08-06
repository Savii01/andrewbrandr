import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2, FiMove, FiImage, FiLoader } from "react-icons/fi";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProcessesFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

interface SortableStepItemProps {
    id: string;
    step: any;
    index: number;
    updateStep: (index: number, field: string, value: any) => void;
    removeStep: (index: number) => void;
    uploadingIndex: number | null;
    handleImageUpload: (index: number, file: File) => Promise<void>;
    handleImageDelete: (index: number) => void;
}

function SortableStepItem({
    id,
    step,
    index,
    updateStep,
    removeStep,
    uploadingIndex,
    handleImageUpload,
    handleImageDelete
}: SortableStepItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)] space-y-4 relative group transition-all ${
                isDragging ? "shadow-2xl ring-2 ring-orange/50 border-orange" : "hover:border-[var(--border-color-hover)]"
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 rounded-lg bg-[var(--surface)] text-[var(--text-muted)] hover:text-orange hover:bg-orange/10 transition-colors"
                        title="Drag to reorder"
                    >
                        <FiMove size={16} />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">
                        Step {step.num}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                    title="Remove step"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="01"
                            value={step.num}
                            onChange={e => updateStep(index, 'num', e.target.value)}
                            className="w-16 bg-[var(--surface)] border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-orange text-center"
                        />
                        <input
                            type="text"
                            placeholder="Step Title"
                            value={step.title}
                            onChange={e => updateStep(index, 'title', e.target.value)}
                            className="flex-1 bg-[var(--surface)] border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-orange"
                        />
                    </div>
                    <div>
                        <textarea
                            rows={3}
                            placeholder="Step Description (supports newlines)"
                            value={step.desc}
                            onChange={e => updateStep(index, 'desc', e.target.value)}
                            className="w-full bg-[var(--surface)] border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-orange resize-none"
                        />
                    </div>
                </div>

                {/* Image Upload Box */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Step Image</label>
                    <div className="relative h-[120px] rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--surface)] flex flex-col items-center justify-center group/img">
                        {step.image ? (
                            <>
                                <img
                                    src={step.image}
                                    alt={`Step ${step.title || index} preview`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(index)}
                                    className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                                >
                                    Delete Image
                                </button>
                            </>
                        ) : (
                            <div className="p-3 w-full text-center flex flex-col items-center justify-center h-full">
                                {uploadingIndex === index ? (
                                    <div className="flex flex-col items-center gap-1">
                                        <FiLoader className="animate-spin text-orange" size={20} />
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiImage className="text-[var(--text-muted)] text-xl mb-1" />
                                        <label className="cursor-pointer text-[10px] font-bold text-orange hover:underline block mb-1">
                                            Upload Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        await handleImageUpload(index, file);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        <span className="text-[9px] text-[var(--text-muted)]">or paste URL:</span>
                                        <input
                                            type="text"
                                            value={step.image || ""}
                                            onChange={(e) => updateStep(index, "image", e.target.value)}
                                            placeholder="https://..."
                                            className="w-full mt-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] rounded px-1.5 py-1 text-[10px] text-center focus:ring-1 focus:ring-orange focus:outline-none"
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProcessesForm({ initialData, onSave, saving }: ProcessesFormProps) {
    const [formData, setFormData] = useState({
        badge: "How the process works",
        heading: "Every project follows a clear structure.",
        subheading: "Not because structure is rigid, but because clarity needs it.",
        ctaText: "Begin the Process",
        ctaLink: "/work-with-me",
        steps: [
            {
                id: "step-default-0",
                num: "01",
                title: "Discovery",
                desc: "We begin with a focused conversation about your business, your position in the market, and what needs to change.",
                image: ""
            }
        ]
    });

    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            const loadedSteps = (initialData.steps || []).map((step: any, index: number) => ({
                id: step.id || `step-${Date.now()}-${index}-${Math.random()}`,
                num: step.num || (index + 1).toString().padStart(2, '0'),
                title: step.title || "",
                desc: step.desc || "",
                image: step.image || ""
            }));
            setFormData(prev => ({
                ...prev,
                ...initialData,
                steps: loadedSteps.length > 0 ? loadedSteps : prev.steps
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const addStep = () => {
        const nextNum = (formData.steps.length + 1).toString().padStart(2, '0');
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, {
                id: `step-${Date.now()}-${Math.random()}`,
                num: nextNum,
                title: "",
                desc: "",
                image: ""
            }]
        }));
    };

    const updateStep = (index: number, field: string, value: any) => {
        const newSteps = [...formData.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setFormData({ ...formData, steps: newSteps });
    };

    const removeStep = (index: number) => {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        // Clean up sequential numbers
        const updatedSteps = newSteps.map((step, idx) => ({
            ...step,
            num: (idx + 1).toString().padStart(2, '0')
        }));
        setFormData({ ...formData, steps: updatedSteps });
    };

    // Upload handlers
    const uploadImageToCloudinary = async (file: File, stepIndex: number) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "892555353158913";
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing. Please check your .env.local file.");
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = `andrewbrandr/processes/step-${stepIndex}`;

        const signatureRes = await fetch("/api/cloudinary/signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paramsToSign: {
                    timestamp,
                    upload_preset: uploadPreset,
                    folder
                }
            })
        });

        if (!signatureRes.ok) {
            const errorData = await signatureRes.json();
            throw new Error(errorData.error || "Failed to generate Cloudinary signature");
        }

        const { signature } = await signatureRes.json();

        const bodyData = new FormData();
        bodyData.append("file", file);
        bodyData.append("api_key", apiKey);
        bodyData.append("timestamp", timestamp.toString());
        bodyData.append("signature", signature);
        bodyData.append("upload_preset", uploadPreset);
        bodyData.append("folder", folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: bodyData
        });

        if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.error?.message || "Cloudinary image upload failed");
        }

        const uploadData = await uploadRes.json();
        return uploadData.secure_url;
    };

    const handleImageUpload = async (index: number, file: File) => {
        setUploadingIndex(index);
        try {
            const imageUrl = await uploadImageToCloudinary(file, index);
            updateStep(index, "image", imageUrl);
        } catch (error: any) {
            console.error("Image upload failed:", error);
            alert(`Upload failed: ${error.message || error}`);
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleImageDelete = (index: number) => {
        updateStep(index, "image", "");
    };

    // Dnd-kit setup
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = formData.steps.findIndex((step) => step.id === active.id);
            const newIndex = formData.steps.findIndex((step) => step.id === over.id);
            const reordered = arrayMove(formData.steps, oldIndex, newIndex);
            // Auto update num order
            const updatedNumSteps = reordered.map((step, idx) => ({
                ...step,
                num: (idx + 1).toString().padStart(2, '0')
            }));
            setFormData({
                ...formData,
                steps: updatedNumSteps
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Process Section</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Manage the structured breakdown of your studio process.</p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Badge / Kicker</label>
                <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Heading</label>
                    <input
                        type="text"
                        value={formData.heading}
                        onChange={e => setFormData({ ...formData, heading: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Subheading</label>
                    <input
                        type="text"
                        value={formData.subheading}
                        onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">CTA Text</label>
                    <input
                        type="text"
                        value={formData.ctaText}
                        onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">CTA Link</label>
                    <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                        className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Process Steps</label>
                    <button
                        type="button"
                        onClick={addStep}
                        className="flex items-center gap-1 text-xs font-bold text-orange hover:text-orange/80 transition-colors"
                    >
                        <FiPlus /> Add Step
                    </button>
                </div>
                
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={formData.steps.map(step => step.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {formData.steps.map((step, index) => (
                                <SortableStepItem
                                    key={step.id}
                                    id={step.id}
                                    step={step}
                                    index={index}
                                    updateStep={updateStep}
                                    removeStep={removeStep}
                                    uploadingIndex={uploadingIndex}
                                    handleImageUpload={handleImageUpload}
                                    handleImageDelete={handleImageDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
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
