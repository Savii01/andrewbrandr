"use client";

import React, { useRef } from "react";
import Button from "./Button";
import { MdArrowOutward } from "react-icons/md";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We begin with a focused conversation about your business, your position in the market, and what needs to change.",
    bgColor: "bg-[#0f0f0f]",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "We define the foundation.\nMission. Vision. Audience. Positioning.\nDirection replaces assumption before design begins.",
    bgColor: "bg-[#cc3300]",
  },
  {
    num: "03",
    title: "Identity",
    desc: "The full visual system is built.\nLogo suite. Typography. Colour. Assets.\nDesigned to work together.",
    bgColor: "bg-[#0f0f0f]",
  },
  {
    num: "04",
    title: "Build & Refine",
    desc: "Application, presentation, and structured refinement.\nEvery decision explained.\nNothing left unclear.",
    bgColor: "bg-[#cc3300]",
  },
  {
    num: "05",
    title: "Launch & Support",
    desc: "Final files, guidelines, and documentation delivered.\nA post‑launch check‑in ensures the brand is doing its job.",
    bgColor: "bg-[#0f0f0f]",
  },
];

export default function Processes() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="process" className="bg-[#0F0000] text-[#fdf3e6] pt-24 pb-48 px-4 relative">
      <div className="max-w-[720px] mx-auto w-full">

        {/* ── Header ── */}
        <div className="flex flex-col items-start mb-20 text-left max-w-[720px]">
          <p className="text-[#fdf3e6]/40 text-[13px] font-bold tracking-tight uppercase mb-8">
            How the process works
          </p>
          <h2 className="text-[28px] sm:text-[28px] text-[#fdf3e6] md:text-[30px] font-bold tracking-tight mb-2">
            Every project follows a clear structure.
          </h2>
          <p className="text-[#fdf3e6]/70 text-[16px] sm:text-[18px] md:text-[18px] font-medium">
            Not because structure is rigid, but because clarity needs it.
          </p>
        </div>

        {/* ── Stacking Cards Container ── */}
        <div
          ref={containerRef}
          className="relative w-full flex flex-col pb-[10vh]"
        >
          {steps.map((step, index) => (
            <div
              key={step.num}
              className={`sticky w-full rounded-[2rem] md:rounded-[3rem] border border-white/10 ${step.bgColor} shadow-2xl p-6 sm:p-10 md:p-8 mb-4`}
              style={{
                top: `calc(120px + ${index * 32}px)`,
                minHeight: "500px",
              }}
            >
              <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between h-full">

                {/* Text Content */}
                <div className="w-full md:w-7/12 flex flex-col items-start justify-center">
                  {/* Step Num Tab */}
                  <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-xl font-bold mb-8">
                    {step.num}
                  </div>

                  {/* Title */}
                  <h3 className="text-[28px] sm:text-[28px] md:text-[28px] font-extrabold mb-6 tracking-tight leading-[1.1]">
                    {step.title}
                  </h3>

                  {/* Paragraph */}
                  <p className="text-white/70 text-[16px] sm:text-[16px] whitespace-pre-line">
                    {step.desc}
                  </p>
                </div>

                {/* Right side: Image Box Block */}
                <div className="w-full md:w-7/12 h-[300px] sm:h-[400px] md:h-full min-h-[350px] relative rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#ffffff]/5 flex items-center justify-center">
                  <span className="text-white/20 font-medium tracking-widest uppercase text-sm">
                    {`{ image box }`}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ── Action Section ── */}
        <div className="mt-5 pt-10 flex border-t border-white/10 w-full">
          <Button
            href="/work-with-me"
            label="Begin the Process"
            icon={MdArrowOutward}
            variant="secondary"
            className="w-full sm:w-auto px-8 py-4 !bg-[#fdf3e6] !text-[#0F0000] !border-[#fdf3e6]/20 hover:!border-[#fdf3e6]/40 transition-colors !text-[15px] !rounded-full !font-bold hover:!bg-[#cc3300] hover:!text-white"
            fullWidth={false}
          />
        </div>

      </div>
    </section>
  );
}