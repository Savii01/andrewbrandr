"use client";

import Button from "@/components/public/Button";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import CTAWithTestimonials from "@/components/public/CTAWithTestimonials";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8 }
};

export default function ProjectsPage() {
    return (
        <div className="pt-32 bg-[#0F0000] min-h-screen overflow-hidden">
            <div className="px-6 lg:px-32 2xl:px-[270px]">
                {/* Hero Section */}
                <motion.section
                    {...fadeInUp}
                    className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20"
                >
                    <span className="bg-orange text-white px-3 py-2 mb-8 rounded-full text-xs uppercase tracking-wide font-medium">
                        • My Projects
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-[#fdf3e6] mb-6 leading-[1]">
                        Check Out Some <br /> Of My Work
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
                        A peek into my bold builds, strategic visuals, and brands that{" "}
                        <em>*actually*</em> work. Every project&apos;s got a story — and a spark.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Button
                            href="/send-message"
                            label="Send a message"
                            variant="primary"
                            icon={MdArrowOutward}
                        />
                        <Button
                            href="/about"
                            label="Learn More"
                            variant="secondary"
                            icon={MdArrowOutward}
                        />
                    </div>
                </motion.section>

                {/* Project Grid */}
                <motion.section
                    {...fadeInUp}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 py-20"
                >
                    {projects.map((project) => (
                        <ProjectListItem key={project.id} project={project} />
                    ))}
                </motion.section>

                {/* CTA Section */}
                <motion.div {...fadeInUp} className="mb-20">
                    <CTAWithTestimonials />
                </motion.div>
            </div>
        </div>
    );
}

import Image from "next/image";

const ProjectListItem = ({ project }: { project: any }) => (
    <div className="group relative">
        <Link
            href={`/projects/${project.id}`}
            className="block relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[var(--surface-elevated)] border border-white/5 transition-all duration-700 hover:shadow-2xl hover:shadow-orange/20"
        >
            {/* Image Wrapper */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />
            </div>

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.category.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-none">
                            {project.name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            View Case Study →
                        </p>
                    </div>
                </div>
            </div>

            {/* Glass Reveal Background */}
            <div className="absolute inset-0 border-[1px] border-white/10 rounded-[2.5rem] pointer-events-none group-hover:border-orange/30 transition-colors duration-500" />
        </Link>
    </div>
);

