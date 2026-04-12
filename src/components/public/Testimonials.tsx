"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { testimonials } from "@/data";
import { generateAvatar } from "@/lib/utils/generateAvatar";
import { MdArrowOutward } from "react-icons/md";
import Button from "./Button";

/**
 * Testimonial component matching the exact design fidelity of the original project.
 */
/**
 * Sub-component for individual testimonial cards
 */
const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  const avatar = generateAvatar(testimonial.name);
  return (
    <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        "{testimonial.review}"
      </p>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.businessName}</p>
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
      {/* Gradient Mask to fade top and bottom */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white dark:from-lilBlack via-transparent to-white dark:to-lilBlack"></div>
    </div>
  );
};

const Testimonials = () => {
  // Split 9 testimonials into 3 columns
  const col1 = testimonials.slice(0, 3);
  const col2 = testimonials.slice(3, 6);
  const col3 = testimonials.slice(6, 9);

  return (
    <section className="bg-white dark:bg-lilBlack py-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-12 text-center">
          <span className="bg-orange text-white px-3 py-2 mb-4 rounded-full text-xs uppercase tracking-wide font-medium">
            • Testimonials
          </span>
          <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-4 leading-tight">
            Why Clients Love Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Trusted by creators and businesses worldwide. Here is what they have to say.
          </p>
        </div>

        {/* Wall of Love Marquee */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <MarqueeColumn items={col1} duration={25} />
          <div className="hidden md:block">
            <MarqueeColumn items={col2} duration={35} reverse />
          </div>
          <div className="hidden lg:block">
            <MarqueeColumn items={col3} duration={30} />
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:justify-center sm:items-center mt-16 sm:flex-row gap-6">
          <p className="text-[14px] lg:text-[18px] text-black dark:text-white">Want to be the next satisfied customer?</p>
          <Button
            href="/work-with-me"
            label="Start a Project"
            variant="primary"
            icon={MdArrowOutward}
            fullWidth={false}
          />

          <Button
            href="/services"
            label="Explore Services"
            variant="secondary"
            icon={MdArrowOutward}
            fullWidth={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
