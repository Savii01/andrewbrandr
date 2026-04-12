"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { experience, socialLinks, projects } from "@/data";
import { FaLinkedin, FaTwitter, FaInstagram, FaBehance, FaFacebook } from "react-icons/fa";

const iconMap: Record<string, React.ElementType> = {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaBehance,
};

export default function AboutMe() {
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


  return (
    <div className="bg-gray-50 dark:bg-black">
      <section id="about" className="flex flex-col items-center justify-center px-6 md:px-16 py-20 2xl:px-72">
        {/* Expert Badge */}
        <div className="flex flex-col items-center gap-2 mb-8 xl:mb-16">
          <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
            • Expert Designer
          </span>
          <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-6 leading-tight text-center">
            Saviour Andrew,<span className="text-gray-600 dark:text-gray-400"> Your Designer</span>
          </h1>
        </div>

        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-4">
          {/* LEFT SIDE - IMAGE + SOCIALS */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col items-center border border-gray-200 dark:border-gray-800">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/AboutMe.png"
                alt="Saviour Andrew"
                fill
                className="object-cover w-full h-full grayscale"
              />
              <div className="absolute bottom-3 left-3 z-10 animate-pulse flex gap-2 bg-white/80 dark:bg-gray-800/10 border border-black dark:border-gray-700 px-4 py-2 rounded-lg">
                <div className="bg-green/35 rounded-full w-4 h-4 flex justify-center items-center">
                  <div className="bg-green rounded-full w-2 h-2"></div>
                </div>
                <p className="text-black dark:text-white text-sm sm:text-base">
                  Available For Work
                </p>
              </div>
            </div>

            <div className="w-full text-left mt-5">
              <h2 className="text-black dark:text-white text-xl font-semibold">Hello I am Saviour Andrew</h2>
              <p className="text-gray-400 text-sm mt-1">
                Visual & Brand Designer • Web Designer & Developer • Digital Designer
              </p>

              <div className="text-black dark:text-white flex gap-4 mt-5 text-xl">
                {socialLinks.map((link, i) => {
                  const Icon = iconMap[link.icon];
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-orange transition"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - ABOUT INFO */}
          <div className="bg-white dark:bg-black rounded-2xl p-8 flex flex-col justify-between border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-black dark:text-gray-400 mb-6 text-[16px] leading-relaxed text-left">
                I’m Saviour Andrew, a Visual & Web Designer passionate about crafting
                bold brand identities and digital experiences that feel thoughtful
                and timeless. I blend creativity with technical precision to create
                seamless brand ecosystems.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Visual Identity",
                  "Branding",
                  "Web Design",
                  "Development",
                  "UI Design",
                  "Digital Design",
                ].map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-black dark:bg-[#1E1E1E] dark:text-gray-300 px-3 py-1 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-gray-300 dark:border-[#1E1E1E] pb-2"
                  >
                    <span className="text-sm text-black dark:text-gray-200">{exp.role}</span>
                    <span className="text-sm text-black dark:text-gray-400">{exp.company}</span>
                    <span className="text-sm text-black dark:text-gray-500">{exp.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Stats */}
            <div className="mt-8 flex items-center justify-between text-black dark:text-gray-400">
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white">{projectCount}+</h3>
                <p className="text-sm">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white">{expCount}+</h3>
                <p className="text-sm">Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
