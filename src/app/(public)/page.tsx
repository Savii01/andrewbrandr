"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Hero from "@/components/public/Hero";
import TrustedBrands from "@/components/public/TrustedBrands";
import ProjectSlider from "@/components/public/ProjectSlider";
import AboutMe from "@/components/public/AboutMe";
import Processes from "@/components/public/Processes";
import Services from "@/components/public/Services";
import Pricing from "@/components/public/Pricing";
import Testimonials from "@/components/public/Testimonials";
import FAQ from "@/components/public/FAQ";

export default function Home() {
  const sectionOptions = { threshold: 0.15, triggerOnce: true };

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
    },
  };

  return (
    <div className="bg-white dark:bg-black">
      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <Hero />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <TrustedBrands />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <ProjectSlider />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <AboutMe />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <Processes />
      </SectionWrapper>

      {/* <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <Services />
      </SectionWrapper> */}

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <Pricing />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <Testimonials />
      </SectionWrapper>

      <SectionWrapper options={sectionOptions} variants={fadeInUp}>
        <FAQ />
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({
  children,
  options,
  variants
}: {
  children: React.ReactNode;
  options: any;
  variants: Variants
}) {
  const { ref, inView } = useInView(options);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
