"use client";

import React, { useEffect, useState } from "react";
import { getSiteContent, SiteContent } from "@/lib/firebase/cms";
import { motion } from "framer-motion";
import Link from "next/link";

import Hero from "@/components/public/Hero";
import SocialProofs from "@/components/public/SocialProofs";
import TheShift from "@/components/public/TheShift";
import ProjectSlider from "@/components/public/ProjectSlider";
import Pricing from "@/components/public/Pricing";
import Testimonials from "@/components/public/Testimonials";
import FAQ from "@/components/public/FAQ";
import Processes from "@/components/public/Processes";
import AboutMe from "@/components/public/AboutMe";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] as const }
};

export default function Home() {
  const [cmsData, setCmsData] = useState<SiteContent | null>(null);

  useEffect(() => {
    async function loadCMS() {
      const data = await getSiteContent();
      setCmsData(data);
    }
    loadCMS();
  }, []);

  return (
    <div className="bg-[#FDF3E6] dark:bg-black min-h-screen text-[#0F0000] dark:text-white selection:bg-[#CC3300] selection:text-white">
      {/* 01 — Hero */}
      <motion.div {...fadeInUp}>
        <Hero cmsData={cmsData?.hero} />
      </motion.div>

      {/* 05 — Project Showcase */}
      <motion.div {...fadeInUp}>
        <ProjectSlider />
      </motion.div>
    
      {/* 02 — Social Proofs */}
      <motion.div {...fadeInUp}>
        <SocialProofs />
      </motion.div>

    
      {/* 03 — The Shift */}
      <motion.div {...fadeInUp}>
        <TheShift cmsData={cmsData?.theShift} />
      </motion.div>

      {/* 04 — Processes */}
      <motion.div {...fadeInUp}>
        <Processes cmsData={cmsData?.processes} />
      </motion.div>
      

      {/* 06 — Pricing */}
      <motion.div {...fadeInUp}>
        <Pricing cmsData={cmsData?.pricing} />
      </motion.div>

      {/* 08 - About */}
      <motion.div {...fadeInUp}>
        <AboutMe />
      </motion.div>

      {/* 07 — Testimonials */}
      <motion.div {...fadeInUp}>
        <Testimonials cmsData={cmsData?.testimonialsContent} />
      </motion.div>

      {/* 08 — About Preview
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-20 border-t border-[#0F0000]/10 dark:border-gray-800">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] mb-6 block">
          09 — About
        </span>
        <h2 className="text-[20px] font-bold text-[#0F0000] dark:text-white mb-2">
          The person behind the structure
        </h2>
        <p className="text-[32px] font-display font-extrabold text-[#0F0000] dark:text-white leading-tight mb-8">
          I’m Andrew.
        </p>
        <p className="text-[20px] sm:text-[22px] text-[#0F0000]/80 dark:text-gray-300 leading-relaxed mb-6 font-medium">
          I build brand systems for businesses ready to grow with clarity.
        </p>
        <p className="text-[16px] sm:text-[18px] text-[#0F0000]/70 dark:text-gray-400 leading-relaxed mb-10">
          I think in systems. Visuals, logic, and emotion connected into one structure. When the foundation is clear, growth becomes possible.
        </p>
        <Link 
          href="/about" 
          className="inline-flex items-center text-sm font-bold text-[#CC3300] hover:text-[#0F0000] dark:hover:text-white transition-colors"
        >
          Read More →
        </Link>
      </motion.section> */}

      {/* 10 — FAQ Section */}
      <motion.div {...fadeInUp}>
        <FAQ cmsData={cmsData?.faq} />
      </motion.div>

      {/* 11 — Final CTA */}
      <motion.section {...fadeInUp} className="max-w-[720px] mx-auto px-6 py-32 text-center border-t border-[#0F0000]/10 dark:border-gray-800">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] mb-6 block">
          10 — CTA
        </span>
        <h2 className="text-[32px] sm:text-[40px] font-display font-extrabold text-[#0F0000] dark:text-white tracking-tight leading-tight mb-10">
          Ready to build it properly?
        </h2>
        <Link 
          href="/work-with-me" 
          className="inline-block bg-[#0F0000] dark:bg-white text-white dark:text-[#0F0000] px-10 py-4 rounded-full text-[15px] font-bold hover:bg-[#CC3300] dark:hover:bg-[#CC3300] dark:hover:text-white transition-all shadow-xl shadow-[#0F0000]/10"
        >
          Start the Process
        </Link>
      </motion.section>
    </div>
  );
}
