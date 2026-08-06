"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

const pricingSlugMap = {
  foundation: "foundation",
  clarity: "clarity",
  scale: "scale",
  enterprise: "enterprise"
};

function CaseStudyContent({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjectData() {
      try {
        setLoading(true);
        // Load all public projects
        const dbProjects = await getProjects(false);
        const formattedDb: Project[] = (dbProjects || []).map((dp: any) => ({
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

        // Merge static and db
        const staticFiltered = staticProjects.filter(sp => !formattedDb.some(dp => dp.slug === sp.slug));
        const allProjects = [...staticFiltered, ...formattedDb];

        // Find current, prev, next
        const currentIndex = allProjects.findIndex(p => p.slug === slug);
        if (currentIndex !== -1) {
          setProject(allProjects[currentIndex]);
          setPrevProject(allProjects[currentIndex - 1] || null);
          setNextProject(allProjects[currentIndex + 1] || null);
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error loading case study:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#FDF3E6] min-h-screen pt-44 flex items-center justify-center text-[#0F0000]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-[#CC3300] rounded-full animate-spin mb-4" />
          <p className="text-[11px] uppercase tracking-widest font-bold opacity-60">Structure loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 bg-[#FDF3E6] text-[#0F0000] selection:bg-[#CC3300] selection:text-white">
      
      {/* ── Case Study Header ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 text-left">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] mb-8 block">
          Case Study •
        </span>
        <h1 className="text-[44px] md:text-[56px] font-display font-extrabold text-[#0F0000] tracking-tight leading-tight mb-8">
          {project.name}
        </h1>
        <div className="flex flex-wrap gap-8 text-[14px] font-bold text-[#0F0000]/60 uppercase tracking-wider mb-6">
          <span>Client: <span className="text-[#0F0000]">{project.client}</span></span>
          <span>Year: <span className="text-[#0F0000]">{project.year}</span></span>
        </div>
        <span className="inline-block px-4 py-2 bg-[#CC3300] text-white text-xs font-bold uppercase rounded-md">
          {stageMap[project.stage] || project.stage}
        </span>
      </motion.section>

      {/* ── Context Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          Context
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/80 leading-relaxed font-medium">
          {project.context}
        </p>
      </motion.section>

      {/* ── The Problem Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          The Problem
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/85 leading-relaxed font-medium">
          {project.problem}
        </p>
      </motion.section>

      {/* ── The Strategy Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          The Strategy
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/85 leading-relaxed font-medium mb-8">
          {project.strategy}
        </p>
        
        {/* Strategy Gallery */}
        {project.strategyImages && project.strategyImages.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {project.strategyImages.map((img, i) => (
              <div key={i} className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/5 border border-[#0F0000]/10">
                <img src={typeof img === 'string' ? img : (img?.url || "")} alt={`Strategy phase ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Creative Direction Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          Creative Direction
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/85 leading-relaxed font-medium mb-8">
          {project.creativeDirection}
        </p>
        
        {/* Creative Direction Gallery */}
        {project.creativeDirectionImages && project.creativeDirectionImages.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {project.creativeDirectionImages.map((img, i) => (
              <div key={i} className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/5 border border-[#0F0000]/10">
                <img src={typeof img === 'string' ? img : (img?.url || "")} alt={`Creative Direction ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Identity System Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          Identity System
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/85 leading-relaxed font-medium mb-8">
          {project.identitySystem}
        </p>
        
        {/* Identity System Gallery */}
        {project.identitySystemImages && project.identitySystemImages.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {project.identitySystemImages.map((img, i) => (
              <div key={i} className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/5 border border-[#0F0000]/10">
                <img src={typeof img === 'string' ? img : (img?.url || "")} alt={`Identity System ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Outcome Section ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 text-left">
        <h2 className="text-[24px] font-display font-extrabold text-[#0F0000] mb-4">
          Outcome
        </h2>
        <p className="text-[17px] sm:text-[18px] text-[#0F0000]/85 leading-relaxed font-medium">
          {project.outcome}
        </p>
      </motion.section>

      {/* ── Testimonial Section ── */}
      {project.testimonial && (
        <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-16 border-t border-[#0F0000]/10 text-left">
          <blockquote className="border-l-4 border-[#CC3300] pl-6 py-2 mb-8">
            <p className="text-[18px] sm:text-[20px] font-medium italic text-[#0F0000]/90 leading-relaxed">
              "{project.testimonial.content}"
            </p>
          </blockquote>
          <div className="flex items-center gap-4 pl-6">
            <div>
              <h5 className="font-bold text-[#0F0000] text-[16px]">{project.testimonial.author}</h5>
              <p className="text-xs font-bold text-[#0F0000]/40 uppercase tracking-widest">{project.testimonial.role}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Built Under / Explore Stage ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-16 border-t border-[#0F0000]/10 text-center">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#0F0000]/40 mb-4 block">
          Built Under
        </span>
        <h3 className="text-[20px] font-bold text-[#0F0000] mb-6">
          {stageMap[project.stage] || project.stage}
        </h3>
        <Link 
          href={`/pricing#stages`}
          className="inline-block bg-[#CC3300] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0F0000] transition-all"
        >
          Explore This Stage
        </Link>
      </motion.section>

      {/* ── Case Study Navigation Footer ── */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-12 border-t border-[#0F0000]/10 flex justify-between items-center text-sm font-bold uppercase tracking-wider text-[#CC3300]">
        <div>
          {prevProject ? (
            <Link href={`/projects/${prevProject.slug}`} className="hover:text-[#0F0000] transition-colors">
              ← Previous Project
            </Link>
          ) : (
            <span className="opacity-20 cursor-not-allowed">← Previous Project</span>
          )}
        </div>

        <div>
          <Link href="/projects" className="text-[#0F0000] hover:text-[#CC3300] transition-colors">
            View All Projects
          </Link>
        </div>

        <div>
          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} className="hover:text-[#0F0000] transition-colors">
              Next Project →
            </Link>
          ) : (
            <span className="opacity-20 cursor-not-allowed">Next Project →</span>
          )}
        </div>
      </motion.section>

    </div>
  );
}

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  return (
    <CaseStudyContent slug={resolvedParams.slug} />
  );
}
