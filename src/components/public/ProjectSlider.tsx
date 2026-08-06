"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MdArrowOutward, MdArrowBack, MdArrowForward } from "react-icons/md";
import { projects } from "@/data";

export default function ProjectSlider() {
  const total = projects.length;
  const displayItems = [...projects, ...projects, ...projects];
  
  const [index, setIndex] = useState(total);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [cardWidth, setCardWidth] = useState(540);
  const [windowWidth, setWindowWidth] = useState(720);

  // Mouse tracking for floating button
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // On mobile, use full viewport width. On desktop, cap at 720 container.
      const viewWidth = Math.min(width, 720);
      setWindowWidth(viewWidth);
      
      if (width < 640) {
        setCardWidth(width - 32); // Card width with padding for visible borders
      } else {
        setCardWidth(540);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const gap = 16;
  const totalUnitWidth = cardWidth + gap;
  const centerOffset = (windowWidth - cardWidth) / 2;

  const next = useCallback(() => {
    if (isResetting) return;
    setIndex((prev) => prev + 1);
  }, [isResetting]);

  const prev = useCallback(() => {
    if (isResetting) return;
    setIndex((prev) => prev - 1);
  }, [isResetting]);

  useEffect(() => {
    if (index >= total * 2) {
      const timer = setTimeout(() => {
        setIsResetting(true);
        setIndex(total);
        setTimeout(() => setIsResetting(false), 50);
      }, 400);
      return () => clearTimeout(timer);
    }
    if (index < total) {
      const timer = setTimeout(() => {
        setIsResetting(true);
        setIndex(total * 2 - 1);
        setTimeout(() => setIsResetting(false), 50);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [index, total]);

  useEffect(() => {
    if (hoveredId !== null) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, hoveredId]);

  return (
    <section className="bg-[#FDF3E6] py-20 md:py-28 flex justify-center overflow-hidden">
      <div className="max-w-[720px] w-full flex flex-col items-center">

        {/* ── Header ── */}
        <div className="px-4 w-full flex flex-col items-center text-center">
          <span className="bg-[#CC3300] text-white text-[14px] font-bold px-8 py-2.5 rounded-full mb-5">
            Works
          </span>
          <h2 className="text-[#0F0000] text-[24px] sm:text-[28px] md:text-[30px] font-bold tracking-tight leading-[1.15] mb-14">
            Every project starts with a problem.
            <br />
            Here&apos;s how we solved them.
          </h2>
        </div>

        {/* ── Seamless Infinite Engine ── */}
        <div className="relative w-full">
          <div className="relative w-full h-[380px] sm:h-[440px] md:h-[400px] overflow-hidden rounded-[2rem]">
            
            <motion.div
              className="flex gap-[16px] h-full"
              animate={{ x: centerOffset - index * totalUnitWidth }}
              transition={isResetting ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 200 }}
            >
              {displayItems.map((project, i) => {
                const isHovered = hoveredId === i;

                return (
                  <Link 
                    key={`${project.slug}-${i}`} 
                    href={`/projects/${project.slug}`} 
                    className="flex-shrink-0 group"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <motion.div
                      className="relative w-full h-full border-6 border-[#0f0000] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setHoveredId(i)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <Image
                        src={typeof project.coverImage === 'string' ? project.coverImage : ((project.coverImage as any)?.url || '')}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="600px"
                      />

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 bg-[#0f0000]/90 backdrop-blur-[2px] z-10 flex flex-col justify-end p-8 sm:p-10 rounded-3xl text-left pointer-events-none"
                      >
                        <h3 className="text-[#FDF3E6] text-2xl sm:text-3xl font-extrabold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {project.name}
                        </h3>
                        <p className="text-[#FDF3E6] text-xs sm:text-sm mb-6 line-clamp-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-bold delay-75">
                          {project.context}
                        </p>
                        <div className="flex flex-wrap gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                          {project.services.map((cat) => (
                            <span
                              key={cat}
                              className="text-[#0f0000] text-[10px] sm:text-[11px] font-bold px-3 py-1.5 border border-[#0f0000] rounded-md bg-[#FDF3E6]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute z-40 bg-[#CC3300] text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl pointer-events-none flex items-center gap-2 whitespace-nowrap"
                        style={{
                          left: smoothX,
                          top: smoothY,
                          x: "-50%",
                          y: "-50%",
                          opacity: isHovered ? 1 : 0,
                          scale: isHovered ? 1 : 0.5,
                        }}
                      >
                        View Project
                        <MdArrowOutward className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>

            {/* ── Fading Edges (Desktop Only) ── */}
            <div
              className="absolute inset-y-0 left-0 w-12 md:w-24 z-20 pointer-events-none hidden md:block bg-[#FDF3E6]/10"
            />
            <div
              className="absolute inset-y-0 right-0 w-12 md:w-24 z-20 pointer-events-none hidden md:block bg-[#FDF3E6]/10"
            />

            {/* ── Navigation Arrows ── */}
            <button
              onClick={prev}
              aria-label="Previous project"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30
                         w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#CC3300] hover:bg-[#a32900] text-white
                         flex items-center justify-center shadow-xl transition-transform hover:scale-110"
            >
              <MdArrowBack className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30
                         w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#CC3300] hover:bg-[#a32900] text-white
                         flex items-center justify-center shadow-xl transition-transform hover:scale-110"
            >
              <MdArrowForward className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* ── View All Work CTA ── */}
        <div className="mt-14 px-4 w-full flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-[15px] font-bold
                       px-10 py-3.5 rounded-full hover:bg-[#CC3300] transition-colors"
          >
            View All Work
            <MdArrowOutward className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
