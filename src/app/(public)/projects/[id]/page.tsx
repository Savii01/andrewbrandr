"use client";

import { use, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CTAWithTestimonials from '@/components/public/CTAWithTestimonials';
import { notFound } from 'next/navigation';
import Button from '@/components/public/Button';
import { FiGlobe } from 'react-icons/fi';
import { FaBehance } from 'react-icons/fa';

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8 }
};

import { useProject } from '@/lib/hooks/useProject';

function ProjectDetailContent({ id }: { id: string }) {
    const { project, loading, error } = useProject(id);

    if (loading) {
        return (
            <div className="bg-white dark:bg-black min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Decoding Room...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        notFound();
    }

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-20 overflow-hidden">
            <div className="px-6 lg:px-32 2xl:px-[350px] py-20">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tighter text-black dark:text-white mb-6 leading-tight">
                        {project.name}
                    </h1>
                    <div className="flex flex-wrap gap-8 text-lg text-gray-600 dark:text-gray-400">
                        <span><strong className="text-black dark:text-white">Client:</strong> {project.client}</span>
                        <span><strong className="text-black dark:text-white">Year:</strong> {project.year}</span>
                    </div>
                </motion.div>

                {/* Project Description */}
                <motion.div {...fadeInUp} className="mb-10">
                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
                        {project.description}
                    </p>
                </motion.div>

                {/* Scope of Work */}
                <motion.div {...fadeInUp} className="mb-10">
                    <h2 className="text-3xl font-display text-black dark:text-white mb-6">Scope of Work</h2>
                    <div className="flex flex-wrap gap-3">
                        {project.category.map((cat, index) => (
                            <span
                                key={index}
                                className="text-sm px-4 py-2 rounded-full bg-gray-100 dark:bg-lilBlack text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-800"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Project Links */}
                <motion.div {...fadeInUp} className="mb-20 flex flex-col sm:flex-row gap-6">
                    {project.website && (
                        <Button
                            href={project.website}
                            label="Visit Website"
                            icon={FiGlobe}
                            variant="orange"
                            fullWidth={false}
                            className=""
                        />
                    )}
                    {project.behance && (
                        <Button
                            href={project.behance}
                            label="View on Behance"
                            icon={FaBehance}
                            variant="secondary"
                            fullWidth={false}
                            className=""
                        />
                    )}
                </motion.div>

                {/* Case Study Summary (Challenge & Solution) */}
                {(project.challenge || project.solution) && (
                    <motion.div {...fadeInUp} className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 border-t border-gray-100 dark:border-gray-800 pt-8">
                        {project.challenge && (
                            <div className="space-y-4">
                                <h3 className="text-lg tracking-tight font-bold text-black">The Challenge</h3>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    "{project.challenge}"
                                </p>
                            </div>
                        )}
                        {project.solution && (
                            <div className="space-y-4">
                                <h3 className="text-lg tracking-tight font-bold text-black">The Solution</h3>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {project.solution}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Project Image Gallery */}
                <div className="grid grid-cols-1 gap-12 mb-32">
                    {project.images.map((img, index) => (
                        <motion.div
                            key={index}
                            {...fadeInUp}
                            className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-400 dark:border-gray-800"
                        >
                            <img
                                src={img}
                                alt={`${project.name} preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </div>

                 {/* Testimonial Section */}
                {project.testimonial && (
                    <motion.div {...fadeInUp} className="mb-32 bg-gray-50 dark:bg-lilBlack rounded-2xl p-10 md:p-20 border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V5C1.017 3.89543 1.91243 3 3.017 3H6.017C8.2261 3 10.017 4.79086 10.017 7V15C10.017 18.3137 7.33072 21 4.017 21H1.017Z" /></svg>
                        </div>
                        <div className="max-w-4xl relative z-10">
                            <p className="text-xl md:text-xl font-display text-black dark:text-white mb-10 leading-tight">
                                "{project.testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center text-white font-bold text-xl uppercase">
                                    {project.testimonial.author[0]}
                                </div>
                                <div>
                                    <h5 className="font-bold text-black dark:text-white text-lg">{project.testimonial.author}</h5>
                                    <p className="text-gray-500 text-sm font-medium">{project.testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                    <div className="text-center mt-20">
                        <Link href="/work" className="px-8 py-4 bg-orange text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-all shadow-xl shadow-orange/20">
                            Back to Portfolio
                        </Link>
                    </div>

                        {/* Custom CTA Card */}
                        <motion.div {...fadeInUp}>
                            <Link
                                href="/work-with-me"
                                className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white dark:bg-lilBlack border-2 border-dashed border-gray-400 dark:border-gray-800 rounded-3xl p-10 text-center hover:border-orange transition-colors group"
                            >
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center text-4xl text-gray-400 group-hover:bg-orange group-hover:text-white transition-all mb-8">
                                    +
                                </div>
                                <p className="text-2xl font-display text-black dark:text-white max-w-xs">
                                    Got a cool idea? This spot is waiting for your success story.
                                </p>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="text-center mt-20">
                        <Link href="/projects" className="text-xl font-bold text-black dark:text-white hover:text-orange transition-colors">
                            View All Projects →
                        </Link>
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div {...fadeInUp} className="mt-32">
                    <CTAWithTestimonials />
                </motion.div>
            </div>
        </div>
    );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>}>
            <ProjectDetailContent id={resolvedParams.id} />
        </Suspense>
    );
}
