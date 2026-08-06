"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { testimonials } from "@/data";
import { generateAvatar } from "@/lib/utils/generateAvatar";
import { MdArrowOutward } from "react-icons/md";
import Button from "./Button";

/**
 * Sub-component for individual testimonial cards — forced light theme
 */
const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  const avatar = generateAvatar(testimonial.name);
  return (
    <div className="bg-[#fef8f2] p-6 rounded-2xl border border-[#0F0000]/10 flex flex-col gap-4 hover:border-[#0F0000]/20 transition-colors">
      <p className="text-gray-700 text-sm leading-relaxed">
        "{testimonial.review}"
      </p>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{testimonial.name}</h3>
          <p className="text-xs text-gray-500">{testimonial.businessName}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Sub-component for a single scrolling column
 */
const MarqueeColumn = ({ items, duration, reverse = false }: { items: typeof testimonials; duration: number; reverse?: boolean }) => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <motion.div
        className="flex flex-col gap-6"
        animate={{
          y: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <TestimonialCard key={`${item.id}-${idx}`} testimonial={item} />
        ))}
      </motion.div>
      {/* Gradient mask — light themed */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#fdf3e6] via-transparent to-[#fdf3e6]"></div>
    </div>
  );
};

interface TestimonialsProps {
  cmsData?: {
    heading?: string;
    subheading?: string;
    list?: { id: number; name: string; businessName: string; review: string }[];
  };
}

const Testimonials = ({ cmsData }: TestimonialsProps) => {
  const heading = cmsData?.heading || "Why Clients Love Us";
  const subheading = cmsData?.subheading || "Trusted by creators and businesses worldwide. Here is what they have to say.";
  const list = cmsData?.list && cmsData.list.length > 0 ? cmsData.list : testimonials;

  // Split testimonials list into three columns
  const col1 = list.slice(0, Math.ceil(list.length / 3));
  const col2 = list.slice(Math.ceil(list.length / 3), Math.ceil((list.length / 3) * 2));
  const col3 = list.slice(Math.ceil((list.length / 3) * 2));

  const displayCol1 = col1.length > 0 ? col1 : list;
  const displayCol2 = col2.length > 0 ? col2 : list;
  const displayCol3 = col3.length > 0 ? col3 : list;

  return (
    <section className="bg-[#fdf3e6] py-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-12 text-center">
          <span className="bg-[#CC3300] text-white px-3 py-2 mb-4 rounded-full text-xs uppercase tracking-wide font-medium">
            • Testimonials
          </span>
          <h2 className="text-[#0F0000] text-[24px] md:text-[36px] lg:text-[40px] font-display font-semibold tracking-tighter mb-4 leading-tight">
            {heading}
          </h2>
          <p className="text-gray-600 max-w-2xl">
            {subheading}
          </p>
        </div>

        {/* Wall of Love Marquee */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <MarqueeColumn items={displayCol1} duration={25} />
          <div className="hidden md:block">
            <MarqueeColumn items={displayCol2} duration={35} reverse />
          </div>
          <div className="hidden lg:block">
            <MarqueeColumn items={displayCol3} duration={30} />
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:justify-center sm:items-center mt-16 sm:flex-row gap-4">
          <p className="text-[14px] lg:text-[18px] text-[#0F0000]">Want to be the next satisfied customer?</p>
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-[15px] font-bold px-10 py-3.5 rounded-full hover:bg-[#CC3300] transition-colors"
          >
            Start a Project
            <MdArrowOutward className="w-5 h-5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-[#0F0000]/30 text-[#0F0000] text-[15px] font-bold px-10 py-3.5 rounded-full hover:bg-[#0F0000] hover:text-white transition-colors"
          >
            See Work
            <MdArrowOutward className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
