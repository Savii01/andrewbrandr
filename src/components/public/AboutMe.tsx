"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { experience, socialLinks, projects } from "@/data";
import { FaLinkedin, FaTwitter, FaInstagram, FaBehance, FaFacebook } from "react-icons/fa";

const iconMap: Record<string, React.ElementType> = {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaBehance,
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
};

interface AboutMeProps {
  cmsData?: {
    badge?: string;
    name?: string;
    roleLine?: string;
    description?: string;
    skills?: string[];
    experience?: { role: string; company: string; year: string }[];
  };
}

export default function AboutMe({ cmsData }: AboutMeProps) {
  const startYear = 2021;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;

  const totalProjects = 20 + (projects?.length || 0);

  const [projectCount, setProjectCount] = useState(0);
  const [expCount, setExpCount] = useState(0);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    const animate = (
      target: number,
      setter: React.Dispatch<React.SetStateAction<number>>,
      duration = 1000
    ) => {
      let start = 0;
      const stepTime = 16;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(start));
        }
      }, stepTime);
      intervals.push(interval);
    };

    animate(totalProjects, setProjectCount);
    animate(yearsOfExperience, setExpCount);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [totalProjects, yearsOfExperience]);

  const name = cmsData?.name || "Saviour Andrew";
  const roleLine = cmsData?.roleLine || "Visual & Brand Designer • Web Designer & Developer • Digital Designer";
  const expList = cmsData?.experience || experience;

  return (
    <div className="bg-[#FDF3E6] dark:bg-black text-[#0F0000] dark:text-white">
      <section id="about" className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-10 w-full text-left">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] block">
            About •
          </span>
          <h2 className="text-[#0F0000] dark:text-white text-[28px] sm:text-[36px] font-bold leading-tight tracking-tight">
            {name}
          </h2>
          <p className="text-[#0F0000]/60 dark:text-gray-400 text-sm font-medium">
            {roleLine}
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* Top Row: Image Card and Bio Card */}
          <div className="grid md:grid-cols-2 gap-6 w-full">
            {/* LEFT SIDE - IMAGE + SOCIALS */}
            <motion.div
              {...fadeInUp}
              className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col justify-between border border-[#0F0000]/10 dark:border-gray-800"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
                <Image
                  src="/images/AboutMe.png"
                  alt={name}
                  fill
                  className="object-cover w-full h-full grayscale"
                />
                <div className="absolute bottom-3 left-3 z-10 flex gap-2 bg-white/80 dark:bg-gray-800/10 border border-black/10 dark:border-gray-700 px-4 py-2 rounded-lg backdrop-blur-md">
                  <div className="bg-green-500/20 rounded-full w-4 h-4 flex justify-center items-center">
                    <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse"></div>
                  </div>
                  <p className="text-[#0F0000] dark:text-white text-xs font-bold">
                    Available For Work
                  </p>
                </div>
              </div>

              <div className="w-full text-left mt-5">
                <h2 className="text-[#0F0000] dark:text-white text-xl font-semibold">Hello I am {name}</h2>
                <p className="text-[#0F0000]/60 dark:text-gray-400 text-sm mt-1">
                  Brand Strategist • Visual Identity Designer
                </p>

                <div className="text-[#0F0000]/70 dark:text-white flex gap-4 mt-5 text-xl">
                  {socialLinks.map((link, i) => {
                    const Icon = iconMap[link.icon];
                    if (!Icon) return null;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#CC3300] transition"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - ABOUT INFO & WORK EXPERIENCE */}
            <motion.div
              {...fadeInUp}
              className="bg-white dark:bg-black rounded-2xl p-8 border border-[#0F0000]/10 dark:border-gray-800"
            >
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed text-left font-medium">
                    I didn’t start in branding theory. I started by needing to make things work.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed text-left mt-4 font-medium">
                    Over time, I kept seeing the same problem: Strong businesses operating with weak brand foundations.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed text-left mt-4 font-medium">
                    The issue wasn’t talent. It was structure. So I built a process around solving that.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed text-left mt-4 font-medium">
                    Not just visuals. Not just logos. But alignment.
                  </p>
                </div>

                <div className="border-l-2 border-[#CC3300] pl-6 py-2 text-[#0F0000] dark:text-white font-bold text-[16px] text-left">
                  Strategy first.<br />
                  Identity second.<br />
                  Application always intentional.
                </div>

                {/* Work Experience */}
                <div className="border-t border-[#0F0000]/10 dark:border-gray-800 pt-6 space-y-3">
                  <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#CC3300] mb-4 text-left">Experience</p>
                  {expList.map((exp, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-[#0F0000]/5 dark:border-gray-900 pb-3"
                    >
                      <span className="text-sm font-semibold text-[#0F0000] dark:text-gray-200">{exp.role}</span>
                      <span className="text-sm text-[#0F0000]/60 dark:text-gray-400">{exp.company}</span>
                      <span className="text-xs font-bold text-[#0F0000]/40 dark:text-gray-500">{exp.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Card - Floating Under Image & Summary */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-black rounded-2xl p-8 border border-[#0F0000]/10 dark:border-gray-800 text-left"
          >
            {/* Flex container for How I Think and Working Together */}
            <div className="flex flex-col md:flex-row gap-8 justify-between items-stretch">
              {/* How I Think */}
              <div className="flex-1 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-[#0F0000]/10 dark:border-gray-800/60 md:pr-8">
                <h3 className="text-lg font-bold mb-3 text-[#0F0000] dark:text-white">How I Think</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  I think in systems. A brand is not decoration. It is a structured expression of how a business thinks and grows. Without structure, design becomes noise. With structure, design becomes leverage.
                </p>
              </div>

              {/* Working Together */}
              <div className="flex-1 md:pl-8">
                <h3 className="text-lg font-bold mb-2 text-[#0F0000] dark:text-white">Working Together</h3>
                <p className="text-[#CC3300] text-xs font-bold uppercase tracking-wider mb-2">Structured. Calm. Intentional.</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• What stage we’re in</li>
                  <li>• What decision is being made</li>
                  <li>• Why it matters</li>
                </ul>
              </div>
            </div>

            {/* Stats + CTAs section under the flex section */}
            <div className="mt-8 pt-8 border-t border-[#0F0000]/10 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Stats */}
              <div className="flex items-center gap-12 text-[#0F0000] dark:text-gray-400">
                <div>
                  <h3 className="text-3xl font-bold text-[#0F0000] dark:text-white">{projectCount}+</h3>
                  <p className="text-xs text-gray-500">Brands built</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#0F0000] dark:text-white">{expCount}+</h3>
                  <p className="text-xs text-gray-500">Years of practice</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4">
                <Link
                  href="/#stages"
                  className="bg-[#0F0000] dark:bg-white text-white dark:text-[#0F0000] px-6 py-3 rounded-full text-xs font-bold hover:bg-[#CC3300] dark:hover:bg-[#CC3300] dark:hover:text-white transition-all text-center"
                >
                  Start the Process
                </Link>
                <Link
                  href="/projects"
                  className="bg-[#CC3300] text-white border border-[#CC3300] px-6 py-3 rounded-full text-xs font-bold hover:bg-white hover:text-[#CC3300] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all text-center"
                >
                  See Work
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
