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
        <div className="pt-32 bg-white dark:bg-black min-h-screen overflow-hidden">
            <div className="px-6 lg:px-32 2xl:px-[270px]">
                {/* Hero Section */}
                <motion.section
                    {...fadeInUp}
                    className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20"
                >
                    <span className="bg-orange text-white px-3 py-2 mb-8 rounded-full text-xs uppercase tracking-wide font-medium">
                        • My Projects
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-black dark:text-white mb-6 leading-[1]">
                        Check Out Some <br /> Of My Work
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
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

const ProjectListItem = ({ project }: { project: any }) => (
    <div className="border border-gray-200 dark:border-gray-800 p-4 md:p-3 rounded-2xl">
        <Link
            href={`/projects/${project.id}`}
            className="group bg-gray-50 dark:bg-lilBlack border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] block origin-center"
        >
            <div className="relative h-[250px] md:h-[300px] overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="p-8 flex flex-col justify-between h-[170px]">
                <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                        {project.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {project.category.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-orange group-hover:text-white transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-6 flex items-center text-orange font-bold">
                    View Project <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
            </div>
        </Link>
    </div>
);

