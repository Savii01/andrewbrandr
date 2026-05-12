"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AvailabilityBadge from "./AvailabilityBadge";
import Button from "./Button";
import { MdArrowOutward } from "react-icons/md";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0F0000] flex items-center justify-center px-4 py-24 md:pt-32 md:pb-8">
      <div className="flex flex-col items-start text-left max-w-[720px] w-full gap-8">

        {/* ── Identity Row: Photo + Icon | Name + Role ── */}
        <div className="flex items-center gap-6">
          {/* Photo + Brand Icon overlapping */}
          <div className="relative flex items-center">
            {/* Profile Photo */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-orange z-20">
              <Image
                src="/images/AboutMe.png"
                alt="Andrew"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Brand Icon — overlapping the photo from the right */}
            <div className="relative -ml-6 w-20 h-20 rounded-full border-2 border-orange overflow-hidden bg-[#0F0000] z-10 flex items-center justify-center">
              <Image
                src="/brand_assets/icon_logo_BLACK.png"
                alt="AndrewBrandr"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          {/* Name + Role */}
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-[#FDF3E6] text-xl md:text-2xl font-bold leading-tight">
              Andrew
            </h2>
            <p className="text-[#FDF3E6] text-base font-medium">
              Brand Strategist & Designer
            </p>
          </div>
        </div>

        {/* ── Headline ── */}
        <h1 className="text-[#FDF3E6] text-[28px] sm:text-[36px] md:text-[36px] font-bold leading-[1.1] tracking-tight max-w-[620px]">
          Your brand is the first conversation <br />your business has with a stranger, and if it’s unclear, they move on.
        </h1>

        {/* ── Supporting Paragraph ── */}
        <p className="text-[#FDF3E6] text-[14px] sm:text-[16px] leading-relaxed max-w-[540px]">
          I build structured brand systems for businesses that need more than
          good visuals. They need clarity, consistency, and a foundation that
          can grow.<br /><br />
          Strategy. Identity. Web.
        </p>

        {/* ── CTA Group ── */}
        <div className="flex flex-col sm:flex-row items-start gap-3 w-full sm:w-auto">
          <Button
            href="/work-with-me"
            label="Start the Process"
            icon={MdArrowOutward}
            variant="secondary"
            className="w-full sm:w-auto px-7 py-3 !bg-[#fdf3e6] !text-[#0F0000] !border-[#fdf3e6]/20 hover:!border-[#fdf3e6]/40 transition-colors !text-[14px] !rounded-full !font-bold hover:!bg-[#cc3300] hover:!text-white"
            fullWidth={false}
          />
          <AvailabilityBadge />
        </div>

      </div>
    </section>
  );
}