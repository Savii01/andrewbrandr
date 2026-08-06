"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjects } from "@/lib/firebase/portfolio";
import { projects as staticProjects, Project } from "@/data/projects";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] as const }
};

const stageMap = {
  foundation: "Stage 01 — Brand Foundation",
  clarity: "Stage 02 — Brand Clarity",
  scale: "Stage 03 — Brand Scale",
  enterprise: "Stage 04 — Enterprise"
};

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    async function loadDbProjects() {
      try {
        const dbProjects = await getProjects(false);
        if (dbProjects && dbProjects.length > 0) {
          // Skip invalid/broken db entries (missing slug or cover image)
          const validDb = dbProjects.filter((dp: any) => dp && dp.slug && (dp.image || dp.coverImage));
          // Merge static and db projects cleanly, avoiding duplicates by slug
          const staticFiltered = staticProjects.filter(sp => !validDb.some((dp: any) => dp.slug === sp.slug));
          const formattedDb = validDb.map((dp: any) => ({
            id: Number(dp.id) || Math.random(),
            slug: dp.slug,
            name: dp.name,
            client: dp.client,
            industry: dp.industry || "",
            year: Number(dp.year) || new Date().getFullYear(),
            stage: dp.stage,
            coverImage: dp.image || dp.coverImage,
            gallery: dp.images || dp.gallery || [],
            services: dp.category || dp.services || [],
            context: dp.context || dp.description || "",
            problem: dp.problem || dp.challenge || "",
            strategy: dp.strategy || dp.solution || "",
            strategyImages: dp.strategyImages || [],
            creativeDirection: dp.creativeDirection || "",
            creativeDirectionImages: dp.creativeDirectionImages || [],
            identitySystem: dp.identitySystem || "",
            identitySystemImages: dp.identitySystemImages || [],
            outcome: dp.outcome || "",
            website: dp.website,
            behance: dp.behance,
            testimonial: dp.testimonial
          }));
          setAllProjects([...staticFiltered, ...formattedDb]);
        }
      } catch (err) {
        console.error("Error loading db projects:", err);
      }
    }
    loadDbProjects();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-[#FDF3E6] text-[#0F0000] selection:bg-[#CC3300] selection:text-white">
      
      {/* Hero Section */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 text-left">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] mb-8 block">
          Work •
        </span>
        <h1 className="text-[44px] md:text-[56px] font-display font-medium text-[#0F0000] tracking-tight leading-none mb-6">
          Every brand here started with a clarity problem.
        </h1>
        <p className="text-[18px] sm:text-[20px] text-[#0F0000]/80 leading-relaxed font-medium">
          These are the systems built to solve them.
        </p>
      </motion.section>

      {/* Showcase Grid */}
      <motion.section {...fadeInUp} className="max-w-[1100px] mx-auto px-6 py-8 flex flex-wrap gap-x-10 gap-y-16">
        {allProjects.map((project) => (
          <div 
            key={project.slug} 
            className="group w-full md:w-[calc(50%-20px)] text-left rounded-2xl border border-[#0F0000]/15 p-3 md:p-4 hover:border-[#0F0000]/30 hover:shadow-lg hover:shadow-[#0F0000]/5 transition-all"
          >
            {/* Aspect Cover Image */}
            <Link 
              href={`/projects/${project.slug}`}
              className="block relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/5 border border-[#0F0000]/5 mb-6"
            >
              <img
                src={typeof project.coverImage === 'string' ? project.coverImage : (project.coverImage?.url || "")}
                alt={project.name}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
              />
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-[28px] font-display font-extrabold text-[#0F0000] group-hover:text-[#CC3300] transition-colors leading-tight">
                  {project.name}
                </h3>
                <span className="inline-block mt-2 text-xs font-bold uppercase tracking-wider text-[#CC3300]">
                  {stageMap[project.stage] || project.stage}
                </span>
              </div>
              <span className="text-sm font-medium text-[#0F0000]/50">
                {project.year}
              </span>
            </div>

            <p className="text-[16px] text-[#0F0000]/85 leading-relaxed mb-6 font-medium">
              {project.outcome}
            </p>

            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 bg-[#CC3300] text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-[#0F0000] transition-colors"
            >
              View Case Study →
            </Link>
          </div>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-20 text-center border-t border-[#0F0000]/10">
        <h2 className="text-[24px] sm:text-[28px] font-display font-extrabold text-[#0F0000] tracking-tight leading-tight mb-4">
          Ready to build yours?
        </h2>
        <Link 
          href="/work-with-me" 
          className="inline-block bg-[#0F0000] text-white px-10 py-4 rounded-full text-[15px] font-bold hover:bg-[#CC3300] transition-all shadow-xl shadow-[#0F0000]/10"
        >
          Start the Process
        </Link>
      </motion.section>

    </div>
  );
}

