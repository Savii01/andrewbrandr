"use client";

import React, { useEffect, useState, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import { MdArrowOutward, MdChevronLeft, MdChevronRight, MdArrowForward } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import Button from "./Button";

const stages = [
  {
    id: 1,
    slug: "foundation",
    stage: "Stage 01",
    title: "Starting Out",
    priceNGN: "₦80,000",
    priceUSD: "$100",
    package: "Strategy Lite • Identity Core",
    description: "A clear, professional identity built to enter the market properly.",
    cta: "View Stage 01",
    link: "/pricing/foundation"
  },
  {
    id: 2,
    slug: "clarity",
    stage: "Stage 02",
    title: "Running, but stuck",
    subtitle: "The business works. But the brand feels disconnected.",
    extra: "It looks different everywhere. Trust isn’t where it should be.",
    priceNGN: "₦300,000",
    priceUSD: "$400",
    package: "Strategy • Identity • Systems",
    description: "Clarity, consistency, and a stronger foundation for growth.",
    cta: "View Stage 02",
    link: "/pricing/clarity"
  },
  {
    id: 3,
    slug: "scale",
    stage: "Stage 03",
    title: "Growing & Scaling",
    subtitle: "The business has evolved. The brand hasn’t kept up.",
    extra: "New markets. Higher expectations. The system needs to scale.",
    priceNGN: "₦900,000",
    priceUSD: "$1,200",
    package: "Strategy • Identity • Web System",
    description: "A scalable brand system built for the next level.",
    cta: "View Stage 03",
    link: "/pricing/scale"
  },
  {
    id: 4,
    slug: "enterprise",
    stage: "Stage 04",
    title: "Enterprise",
    subtitle: "Rebuilding at scale.",
    extra: "Governance. Systems. Multi-platform execution.",
    priceNGN: "Custom scoped",
    priceUSD: "Custom scoped",
    package: "Full Strategy • Identity • Systems • Expression",
    description: "A complete brand operating system built for any team, at any scale.",
    cta: "View Enterprise",
    link: "/pricing/enterprise"
  }
];

const Pricing = () => {
  const [mounted, setMounted] = useState(false);
  const [isNigeria, setIsNigeria] = useState(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Africa/Lagos") setIsNigeria(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [mounted]);

  return (
    <div id="pricing" className="bg-[#FDF3E6] py-20 overflow-hidden">
      <div className="mx-4 flex flex-col justify-center items-center">
        
        {/* ── Header ── */}
        <div className="max-w-[720px] text-left w-full mb-14">
          <span className="bg-[#CC3300] text-white px-8 py-2.5 mb-5 rounded-full text-[14px] font-bold inline-block">
            Find your stage
          </span>
          <h2 className="text-[#0F0000] text-[24px] sm:text-[28px] md:text-[30px] font-bold tracking-tight leading-[1.15] mb-6">
            Growth happens in phases.
            <br />
            Your brand should reflect the one you&apos;re in.
          </h2>
        </div>

        {/* ── Original Swiper Carousel ── */}
        <div className="w-full max-w-[720px] relative mb-20 px-4 md:px-0">

          {/* Left Arrow */}
          <button
            ref={prevRef}
            className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#0F0000] text-[#FDF3E6] hover:bg-[#CC3300] transition-colors flex items-center justify-center shadow-xl"
          >
            <MdChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            ref={nextRef}
            className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#0F0000] text-[#FDF3E6] hover:bg-[#CC3300] transition-colors flex items-center justify-center shadow-xl"
          >
            <MdChevronRight size={20} />
          </button>

          <div className="bg-[#0F0000] rounded-[2.5rem] p-2 sm:p-3">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay]}
              spaceBetween={8}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
              }}
              loop={true}
              speed={800}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              className="w-full"
            >
              {stages.map((item) => (
                <SwiperSlide key={item.id} className="!h-auto">
                  <div className="h-full border border-white/10 rounded-[2.2rem] p-6 sm:p-8 md:p-10 bg-[#fdf3e6] flex flex-col transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[12px] font-bold uppercase bg-[#0f0000] text-[#fdf3e6] rounded-full py-1 px-4">
                        {item.stage}
                      </span>
                      <span className="text-[18px] md:text-[20px] font-extrabold text-[#0F0000]">
                        {mounted && isNigeria ? item.priceNGN : item.priceUSD}
                      </span>
                    </div>

                    <h3 className="text-[24px] md:text-[28px] font-extrabold text-[#0F0000] leading-tight mb-4">
                      {item.title}
                    </h3>
                    
                    <p className="text-[#0F0000] text-[15px] md:text-[16px] leading-relaxed mb-4 font-bold">
                      {item.subtitle}
                    </p>
                    
                    {item.extra && (
                      <p className="text-[#0F0000]/60 text-[14px] leading-relaxed mb-6">
                        {item.extra}
                      </p>
                    )}
                    
                    <div className="flex-1 border-t border-[#0f0000]/10 pt-6 mb-8">
                      <p className="text-[11px] font-bold uppercase text-[#0f0000]/50 mb-2">
                        Package Includes
                      </p>
                      <p className="text-[14px] font-bold text-[#0f0000] mb-4">
                        {item.package}
                      </p>
                      <p className="text-[14px] text-[#0f0000]/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <Link 
                      href={item.link}
                      className="inline-flex items-center justify-between w-full bg-[#0f0000] text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-[#CC3300] transition-colors group"
                    >
                      {item.cta}
                      <MdArrowOutward className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ── The Investment Section ── */}
        <div className="max-w-[720px] w-full bg-[#5C1500] rounded-[2rem] p-10 md:p-16 text-left">
          <span className="text-[#5C1500] bg-[#FDF3E6] px-4 py-1.5 rounded-full text-[14px] font-bold mb-6 inline-block">
            The Investment
          </span>
          <h2 className="text-[#FDF3E6] text-[28px] md:text-[32px] font-extrabold tracking-tight mb-4 leading-tight">
            A strong brand is not an expense.
          </h2>
          
          <div className="space-y-4 text-[#FDF3E6]/90 text-[14px] md:text-[16px] max-w-[720px] leading-relaxed font-medium">
            <p>
              It&apos;s the foundation your growth depends on.
              Each stage is designed around what your business actually needs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-start items-start  gap-4">
              <span className="bg-[#fdf3e6]/10 text-[#FDF3E6]/80 border border-[#FDF3E6] px-6 py-2 rounded-full text-[14px] font-bold">
                No bloated retainers
              </span>
              <span className="bg-[#fdf3e6]/10 text-[#FDF3E6]/80 border border-[#FDF3E6] px-6 py-2 rounded-full text-[14px] font-bold">
                No unnecessary add-ons
              </span>
            </div>

            <p className="opacity-80">
              Every project begins with discovery and a tailored proposal before payment is made.
            </p>
            
            <p className="text-[20px] md:text-[24px] font-black text-[#FDF3E6] opacity-100 pt-4">
              Clarity first. Then commitment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
