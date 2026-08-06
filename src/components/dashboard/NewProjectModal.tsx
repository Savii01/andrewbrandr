"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiImage, FiLink, FiCheckCircle, FiInfo, FiTag, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { createProject, updateProject } from "@/lib/firebase/portfolio";
import { Project } from "@/lib/types/portfolio";

export default function NewProjectModal({
    isOpen,
    onClose,
    projectToEdit
}: {
    isOpen: boolean;
    onClose: () => void;
    projectToEdit?: Project | null;
}) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        client: "",
        industry: "",
        coverImage: "" as string | { url: string; publicId: string },
        services: [] as string[],
        stage: "foundation" as "foundation" | "clarity" | "scale" | "enterprise",
        year: new Date().getFullYear(),
        context: "",
        problem: "",
        strategy: "",
        strategyImages: [] as (string | { url: string; publicId: string })[],
        creativeDirection: "",
        creativeDirectionImages: [] as (string | { url: string; publicId: string })[],
        identitySystem: "",
        identitySystemImages: [] as (string | { url: string; publicId: string })[],
        outcome: "",
        website: "",
        behance: "",
        testimonialAuthor: "",
        testimonialRole: "",
        testimonialContent: "",
        isPublic: true,
        order: 0
    });

    const [serviceInput, setServiceInput] = useState("");
    const [creativeImageInput, setCreativeImageInput] = useState("");
    const [identityImageInput, setIdentityImageInput] = useState("");

    // ── Edit Mode: Populate form when projectToEdit is provided ──
    useEffect(() => {
        if (projectToEdit && isOpen) {
            setFormData({
                name: projectToEdit.name || "",
                client: projectToEdit.client || "",
                industry: projectToEdit.industry || "",
                coverImage: projectToEdit.coverImage || "",
                services: projectToEdit.services || [],
                stage: projectToEdit.stage || "foundation",
                year: projectToEdit.year || new Date().getFullYear(),
                context: projectToEdit.context || "",
                problem: projectToEdit.problem || "",
                strategy: projectToEdit.strategy || "",
                strategyImages: [],
                creativeDirection: projectToEdit.creativeDirection || "",
                creativeDirectionImages: projectToEdit.creativeDirectionImages || [],
                identitySystem: projectToEdit.identitySystem || "",
                identitySystemImages: projectToEdit.identitySystemImages || [],
                outcome: projectToEdit.outcome || "",
                website: projectToEdit.website || "",
                behance: projectToEdit.behance || "",
                testimonialAuthor: projectToEdit.testimonial?.author || "",
                testimonialRole: projectToEdit.testimonial?.role || "",
                testimonialContent: projectToEdit.testimonial?.content || "",
                isPublic: projectToEdit.isPublic ?? true,
                order: (projectToEdit as any).order || 0
            });
            setStep(1);
        }
    }, [projectToEdit, isOpen]);

    const addService = () => {
        if (serviceInput && !formData.services.includes(serviceInput)) {
            setFormData({ ...formData, services: [...formData.services, serviceInput] });
            setServiceInput("");
        }
    };

    const removeService = (tag: string) => {
        setFormData({ ...formData, services: formData.services.filter(s => s !== tag) });
    };

    const addCreativeImage = () => {
        if (creativeImageInput && !formData.creativeDirectionImages.includes(creativeImageInput)) {
            setFormData({ ...formData, creativeDirectionImages: [...formData.creativeDirectionImages, creativeImageInput] });
            setCreativeImageInput("");
        }
    };

    const addIdentityImage = () => {
        if (identityImageInput && !formData.identitySystemImages.includes(identityImageInput)) {
            setFormData({ ...formData, identitySystemImages: [...formData.identitySystemImages, identityImageInput] });
            setIdentityImageInput("");
        }
    };

    // ── Gallery Image Reorder ──
    const moveImage = (type: "creative" | "identity", index: number, direction: "left" | "right") => {
        const key = type === "creative" ? "creativeDirectionImages" : "identitySystemImages";
        const images = [...formData[key]];
        const newIndex = direction === "left" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;
        [images[index], images[newIndex]] = [images[newIndex], images[index]];
        setFormData({ ...formData, [key]: images });
    };

    // ── Unified Image Upload: Cloudinary ──
    const uploadImage = async (file: File, type: "cover" | "creative" | "identity") => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "892555353158913";
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        const currentSlug = formData.name
            ? formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            : "temp-project";

        setUploading(type);
        try {
            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary configuration is missing. Please check your .env.local file.");
            }

            const timestamp = Math.round(new Date().getTime() / 1000);
            const folder = `andrewbrandr/projects/${currentSlug}/${type}`;

            const signatureRes = await fetch("/api/cloudinary/signature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paramsToSign: { timestamp, upload_preset: uploadPreset, folder }
                })
            });

            if (!signatureRes.ok) throw new Error("Cloudinary signature request failed");

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

            if (!uploadRes.ok) throw new Error("Cloudinary upload failed");

            const uploadData = await uploadRes.json();
            return {
                url: uploadData.secure_url as string,
                publicId: uploadData.public_id as string
            };
        } finally {
            setUploading(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const slug = formData.name.toLowerCase().trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const projectPayload = {
                slug,
                name: formData.name,
                client: formData.client,
                industry: formData.industry,
                year: Number(formData.year) || new Date().getFullYear(),
                stage: formData.stage,
                coverImage: formData.coverImage,
                services: formData.services,
                context: formData.context,
                problem: formData.problem,
                strategy: formData.strategy,
                strategyImages: [],
                creativeDirection: formData.creativeDirection,
                creativeDirectionImages: formData.creativeDirectionImages,
                identitySystem: formData.identitySystem,
                identitySystemImages: formData.identitySystemImages,
                outcome: formData.outcome,
                website: formData.website,
                behance: formData.behance,
                testimonial: formData.testimonialContent ? {
                    author: formData.testimonialAuthor,
                    role: formData.testimonialRole,
                    content: formData.testimonialContent
                } : undefined,
                isPublic: formData.isPublic,
                order: Number(formData.order) || 0
            };

            if (projectToEdit) {
                // Edit mode: update existing project
                await updateProject(projectToEdit.id, projectPayload as any);
            } else {
                // Create mode: new project
                await createProject(projectPayload as any);
            }

            onClose();
            setStep(1);
            // Reset form
            setFormData({
                name: "",
                client: "",
                industry: "",
                coverImage: "",
                services: [],
                stage: "foundation",
                year: new Date().getFullYear(),
                context: "",
                problem: "",
                strategy: "",
                strategyImages: [],
                creativeDirection: "",
                creativeDirectionImages: [],
                identitySystem: "",
                identitySystemImages: [],
                outcome: "",
                website: "",
                behance: "",
                testimonialAuthor: "",
                testimonialRole: "",
                testimonialContent: "",
                isPublic: true,
                order: 0
            });
        } catch (error) {
            console.error("Error saving project:", error);
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
                className="relative w-full max-w-3xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Form Header */}
                <div className="p-8 border-b border-[var(--border-color)] bg-[var(--surface-elevated)]/50">
                    <div className="flex items-center gap-3 text-orange mb-2">
                        <FiPlus size={20} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Portfolio Showcase</span>
                    </div>
                    <h2 className="text-2xl font-display text-[var(--text-primary)]">
                        {projectToEdit ? "Edit Case Study" : "Add Process Case Study"}
                    </h2>
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
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Industry</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        placeholder="e.g. SaaS / Cloud Technology"
                                    />
                                </div>
                                <div className="space-y-2">
                                     <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Cover Image</label>
                                     <div className="flex flex-col gap-3">
                                         {formData.coverImage ? (
                                             <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--surface-elevated)] group">
                                                 <img
                                                     src={typeof formData.coverImage === 'string' ? formData.coverImage : formData.coverImage.url}
                                                     alt="Cover preview"
                                                     className="w-full h-full object-cover"
                                                 />
                                                 <button
                                                     type="button"
                                                     onClick={() => setFormData({ ...formData, coverImage: "" })}
                                                     className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white rounded-full p-2 text-xs transition-colors font-bold"
                                                 >
                                                     Remove
                                                 </button>
                                             </div>
                                         ) : (
                                             <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/75 transition-colors">
                                                 {uploading === "cover" ? (
                                                     <div className="flex flex-col items-center">
                                                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mb-2"></div>
                                                         <span className="text-xs text-[var(--text-muted)] font-bold">Uploading image...</span>
                                                     </div>
                                                 ) : (
                                                     <>
                                                         <FiImage className="text-orange text-3xl mb-2" />
                                                         <label className="cursor-pointer text-xs font-bold text-orange hover:underline">
                                                             Upload cover image file
                                                             <input
                                                                 type="file"
                                                                 accept="image/*"
                                                                 onChange={async (e) => {
                                                                     const file = e.target.files?.[0];
                                                                     if (file) {
                                                                         try {
                                                                             const res = await uploadImage(file, "cover");
                                                                             setFormData({ ...formData, coverImage: res });
                                                                         } catch (err: any) {
                                                                             alert(err.message);
                                                                         }
                                                                     }
                                                                 }}
                                                                 className="hidden"
                                                             />
                                                         </label>
                                                         <span className="text-[10px] text-[var(--text-muted)] mt-1">PNG, JPG, WEBP, AVIF up to 10MB</span>
                                                         <span className="text-[10px] text-[var(--text-muted)] my-2">or</span>
                                                         <input
                                                             type="text"
                                                             onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                             placeholder="Paste manual cover image URL..."
                                                             className="w-full max-w-md bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg p-2.5 text-xs text-center focus:ring-1 focus:ring-orange focus:outline-none"
                                                         />
                                                     </>
                                                 )}
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Stage</label>
                                        <select
                                            value={formData.stage}
                                            onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        >
                                            <option value="foundation">Stage 01 — Foundation</option>
                                            <option value="clarity">Stage 02 — Clarity</option>
                                            <option value="scale">Stage 03 — Scale</option>
                                            <option value="enterprise">Stage 04 — Enterprise</option>
                                        </select>
                                    </div>
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
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                            className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                        />
                                    </div>
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

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Services Offered</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={serviceInput}
                                            onChange={(e) => setServiceInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addService()}
                                            className="flex-1 bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                            placeholder="e.g. Identity System"
                                        />
                                        <button 
                                            type="button"
                                            onClick={addService}
                                            className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-orange"
                                        >
                                            <FiTag />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.services.map(s => (
                                            <span key={s} className="px-2 py-1 bg-orange/10 text-orange rounded-md text-[10px] font-bold flex items-center gap-1">
                                                {s}
                                                <button type="button" onClick={() => removeService(s)} className="hover:text-red-500">×</button>
                                            </span>
                                        ))}
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
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Context</label>
                                    <textarea
                                        value={formData.context}
                                        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="2-3 sentences describing project environment..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">The Problem</label>
                                    <textarea
                                        value={formData.problem}
                                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="Detailed diagnosis of what was holding client back..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">The Strategy</label>
                                    <textarea
                                        value={formData.strategy}
                                        onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="What was defined before design began..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Creative Direction</label>
                                    <textarea
                                        value={formData.creativeDirection}
                                        onChange={(e) => setFormData({ ...formData, creativeDirection: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="Visual system selector direction..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Identity System</label>
                                    <textarea
                                        value={formData.identitySystem}
                                        onChange={(e) => setFormData({ ...formData, identitySystem: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="System layout and deliverables breakdown..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Outcome</label>
                                    <textarea
                                        value={formData.outcome}
                                        onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                                        className="w-full bg-[var(--surface-elevated)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-20 resize-none"
                                        placeholder="Concrete metrics and growth shift..."
                                    />
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
                                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-elevated)]/50">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-orange mb-4">Client Testimonial (Optional)</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Author Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.testimonialAuthor}
                                                    onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                                                    className="w-full bg-[var(--surface)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                                    placeholder="e.g. Jane Doe"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Role / Company</label>
                                                <input
                                                    type="text"
                                                    value={formData.testimonialRole}
                                                    onChange={(e) => setFormData({ ...formData, testimonialRole: e.target.value })}
                                                    className="w-full bg-[var(--surface)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange"
                                                    placeholder="e.g. CEO at Nexova"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Quote Content</label>
                                            <textarea
                                                value={formData.testimonialContent}
                                                onChange={(e) => setFormData({ ...formData, testimonialContent: e.target.value })}
                                                className="w-full bg-[var(--surface)] text-[var(--text-primary)] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-orange h-24 resize-none"
                                                placeholder="What did the client say about the outcomes?"
                                            />
                                        </div>
                                    </div>

                                    {/* ── Phase-Specific Galleries ── */}
                                    <div className="space-y-4 mt-6 pt-4 border-t border-[var(--border-color)]">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-orange">Phase-Specific Galleries</h3>

                                        {/* Creative Direction Gallery */}
                                        <div className="space-y-2 p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-color)]">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Creative Direction Images</label>

                                            {formData.creativeDirectionImages.length > 0 && (
                                                <div className="grid grid-cols-5 gap-2 mb-3">
                                                    {formData.creativeDirectionImages.map((img: any, idx: number) => (
                                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--surface)] group">
                                                            <img
                                                                src={typeof img === 'string' ? img : img.url}
                                                                alt={`Creative ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                                                                {idx > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveImage("creative", idx, "left")}
                                                                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                                                                        title="Move left"
                                                                    >
                                                                        <FiArrowLeft size={12} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const filtered = formData.creativeDirectionImages.filter((_, i) => i !== idx);
                                                                        setFormData({ ...formData, creativeDirectionImages: filtered });
                                                                    }}
                                                                    className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500 text-white text-[10px] font-bold transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    ×
                                                                </button>
                                                                {idx < formData.creativeDirectionImages.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveImage("creative", idx, "right")}
                                                                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                                                                        title="Move right"
                                                                    >
                                                                        <FiArrowRight size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <label className="flex-1 flex items-center justify-center p-3 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer text-xs font-bold text-orange gap-2">
                                                    {uploading === "creative" ? (
                                                        <span className="animate-pulse">Uploading image...</span>
                                                    ) : (
                                                        <>
                                                            <FiImage /> Upload File
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        try {
                                                                            const res = await uploadImage(file, "creative");
                                                                            setFormData(prev => ({ ...prev, creativeDirectionImages: [...prev.creativeDirectionImages, res] }));
                                                                        } catch (err: any) {
                                                                            alert(err.message);
                                                                        }
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </>
                                                    )}
                                                </label>
                                                <div className="flex-[2] flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={creativeImageInput}
                                                        onChange={(e) => setCreativeImageInput(e.target.value)}
                                                        className="flex-1 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl p-3 text-xs"
                                                        placeholder="Or paste URL..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (creativeImageInput) {
                                                                setFormData({ ...formData, creativeDirectionImages: [...formData.creativeDirectionImages, creativeImageInput] });
                                                                setCreativeImageInput("");
                                                            }
                                                        }}
                                                        className="px-4 bg-orange text-white text-xs font-bold rounded-xl"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Identity System Gallery */}
                                        <div className="space-y-2 p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-color)]">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Identity System Images</label>

                                            {formData.identitySystemImages.length > 0 && (
                                                <div className="grid grid-cols-5 gap-2 mb-3">
                                                    {formData.identitySystemImages.map((img: any, idx: number) => (
                                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--surface)] group">
                                                            <img
                                                                src={typeof img === 'string' ? img : img.url}
                                                                alt={`Identity ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                                                                {idx > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveImage("identity", idx, "left")}
                                                                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                                                                        title="Move left"
                                                                    >
                                                                        <FiArrowLeft size={12} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const filtered = formData.identitySystemImages.filter((_, i) => i !== idx);
                                                                        setFormData({ ...formData, identitySystemImages: filtered });
                                                                    }}
                                                                    className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500 text-white text-[10px] font-bold transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    ×
                                                                </button>
                                                                {idx < formData.identitySystemImages.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveImage("identity", idx, "right")}
                                                                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                                                                        title="Move right"
                                                                    >
                                                                        <FiArrowRight size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <label className="flex-1 flex items-center justify-center p-3 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer text-xs font-bold text-orange gap-2">
                                                    {uploading === "identity" ? (
                                                        <span className="animate-pulse">Uploading image...</span>
                                                    ) : (
                                                        <>
                                                            <FiImage /> Upload File
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        try {
                                                                            const res = await uploadImage(file, "identity");
                                                                            setFormData(prev => ({ ...prev, identitySystemImages: [...prev.identitySystemImages, res] }));
                                                                        } catch (err: any) {
                                                                            alert(err.message);
                                                                        }
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </>
                                                    )}
                                                </label>
                                                <div className="flex-[2] flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={identityImageInput}
                                                        onChange={(e) => setIdentityImageInput(e.target.value)}
                                                        className="flex-1 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl p-3 text-xs"
                                                        placeholder="Or paste URL..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (identityImageInput) {
                                                                setFormData({ ...formData, identitySystemImages: [...formData.identitySystemImages, identityImageInput] });
                                                                setIdentityImageInput("");
                                                            }
                                                        }}
                                                        className="px-4 bg-orange text-white text-xs font-bold rounded-xl"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange/10 text-orange">
                                            <FiCheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Public Visibility</p>
                                            <p className="text-[10px] text-[var(--text-muted)]">Visible on the case study work pages</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                                        className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublic ? 'bg-orange' : 'bg-[var(--surface)] border border-[var(--border-color)]'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublic ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {step === 1 ? "Cancel" : "Back"}
                        </button>

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20 disabled:opacity-50"
                            >
                                {loading ? "Publishing..." : projectToEdit ? "Save Changes" : "Publish Project"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
