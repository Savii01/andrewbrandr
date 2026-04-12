"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { projects } from "@/data";

export default function ProjectSlider() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="py-20 bg-white dark:bg-black"
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex justify-between items-end mb-12">
                    <div className="text-left">
                        <h2 className="font-customFont text-[24px] md:text-[36px] lg:text-[40px] font-semibold text-black dark:text-white tracking-tighter mb-6 leading-tight">
                            Selected work
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            A curated selection of projects that represent my approach to design and identity.
                        </p>
                    </div>
                    <Link
                        href="/projects"
                        className="hidden md:inline-flex text-sm text-orange hover:text-orange-light transition-colors font-medium"
                    >
                        View all projects →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.slice(0, 4).map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <Link href={`/projects/${project.id}`} className="group block text-left">
                                <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100 dark:bg-lilBlack">
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-start">
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-orange transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {project.client}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        {project.category.slice(0, 2).map((cat) => (
                                            <span
                                                key={cat}
                                                className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/projects"
                        className="text-sm text-orange hover:text-orange-light transition-colors font-medium"
                    >
                        View all projects →
                    </Link>
                </div>
            </div>
        </motion.section>
    );
}
