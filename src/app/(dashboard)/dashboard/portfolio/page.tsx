"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlus, FiImage, FiMoreVertical, FiEye, FiEyeOff, FiTrash2, FiExternalLink, FiEdit2 } from "react-icons/fi";
import { getProjects, updateProject, deleteProject } from "@/lib/firebase/portfolio";
import { Project } from "@/lib/types/portfolio";
import NewProjectModal from "@/components/dashboard/NewProjectModal";

export default function PortfolioAdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        const data = await getProjects(true); // Include private
        setProjects(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const toggleVisibility = async (id: string, current: boolean) => {
        await updateProject(id, { isPublic: !current });
        fetchProjects();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this project from your showcase?")) {
            await deleteProject(id);
            fetchProjects();
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <NewProjectModal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setProjectToEdit(null);
                fetchProjects();
            }} projectToEdit={projectToEdit} />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Showcase Management
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Curate your public portfolio and case studies
                    </p>
                </div>
                
                <button
                    onClick={() => { setProjectToEdit(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                >
                    <FiPlus size={18} />
                    New Project
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-[var(--surface)] border border-[var(--border-color)] animate-pulse" />
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden hover:border-orange/30 transition-all"
                        >
                            {/* Project Preview */}
                            <div className="aspect-video relative overflow-hidden bg-[var(--surface-elevated)]">
                                {(project.coverImage || (project as any).image) ? (
                                    <img 
                                        src={
                                            typeof (project.coverImage || (project as any).image) === 'string'
                                                ? (project.coverImage || (project as any).image)
                                                : ((project.coverImage as any)?.url || (project as any).image?.url || "")
                                        } 
                                        alt={project.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                        <FiImage size={32} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => toggleVisibility(project.id, project.isPublic)}
                                        className={`p-2 rounded-lg backdrop-blur-md border transition-all ${project.isPublic ? 'bg-green/10 border-green text-green' : 'bg-orange/10 border-orange text-orange'}`}
                                    >
                                        {project.isPublic ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{project.name}</h3>
                                        <p className="text-xs font-bold text-[var(--text-muted)]">{project.client}</p>
                                    </div>
                                    <button className="text-[var(--text-muted)] hover:text-orange">
                                        <FiMoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(project.services || (project as any).category || []).slice(0, 2).map((cat: string) => (
                                        <span key={cat} className="px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)]">
                                            {cat}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                    <span className="text-xs font-bold text-[var(--text-muted)]">
                                        Added {project.createdAt?.seconds ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => { setProjectToEdit(project); setIsModalOpen(true); }}
                                            className="p-2 text-orange/40 hover:text-orange transition-colors"
                                            title="Edit project"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(project.id)}
                                            className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                        <button className="p-2 text-orange/40 hover:text-orange transition-colors">
                                            <FiExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed border-[var(--border-color)] bg-[var(--surface)] text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-muted)] mb-6">
                        <FiImage size={32} />
                    </div>
                    <h3 className="text-xl font-display text-[var(--text-primary)] mb-2">Portfolio is empty</h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto mb-8">
                        Your showcase is currently empty. Add your best work to start curating your public presence.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                    >
                        Add Your First Project
                    </button>
                </div>
            )}
        </div>
    );
}

