"use client";

import React, { useEffect, useState, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import { MdArrowOutward, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { pricingPlans } from "@/lib/pricingPlans";

import Button from "./Button";

const Pricing = () => {
  const [isNigeria, setIsNigeria] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Africa/Lagos") {
        setIsNigeria(true);
      }
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

      setTimeout(() => {
        const swiperEl = swiperInstance.el;
        if (!swiperEl) return;

        const handleMouseEnter = () => swiperInstance.autoplay?.stop();
        const handleMouseLeave = () => swiperInstance.autoplay?.start();

        swiperEl.addEventListener("mouseenter", handleMouseEnter);
        swiperEl.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          swiperEl.removeEventListener("mouseenter", handleMouseEnter);
          swiperEl.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, 0);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-black py-20 overflow-hidden">
      <div className="mx-4 flex flex-col justify-center items-center">
        <div className="mx-2 max-w-4xl text-center">
          <div className="flex flex-col items-center gap-2 mb-8 xl:mb-14">
            <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
              • Work With Me
            </span>
            <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-6 leading-tight">
              Choose How You&apos;d Like To Collaborate
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-[16px] max-w-2xl">
              Whether you need a one-time creative project or ongoing design support,
              choose an option that fits your goals and let&apos;s bring your vision to life.
            </p>
          </div>
        </div>

        {/* Swiper Carousel with side arrows */}
        <div className="w-full max-w-[1400px] relative px-4 md:px-12 lg:px-16">

          {/* Left Arrow */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-white dark:text-black flex items-center justify-center"
          >
            <MdChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-white dark:text-black flex items-center justify-center"
          >
            <MdChevronRight size={24} />
          </button>

          <div className="bg-black dark:bg-[#1e1e1e] rounded-[2rem] p-2 lg:p-3">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay]}
              spaceBetween={8}
              slidesPerView={1}
              loop={true}
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
              }}
              className="w-full"
            >
              {pricingPlans.map((plan) => {
                const price = mounted && isNigeria ? plan.priceNGN : plan.priceUSD;

                return (
                  <SwiperSlide key={plan.id} className="!h-auto">
                    <div className="h-full border border-black dark:border-gray-400 rounded-[28px] p-6 lg:p-8 bg-white dark:bg-lilBlack flex flex-col transition-colors duration-300">
                      {/* Header */}
                      <div className="mb-3 text-left">
                        <h4 className="text-2xl lg:text-3xl font-customFont font-semibold dark:text-white text-black mb-3 leading-tight">{plan.subtitle}</h4>
                        <h3 className="text-lg font-bold text-orange mb-3 inline-block bg-orange/10 px-2 py-1 rounded-md">{plan.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                      </div>

                      {/* Divider */}
                      <div className="bg-gray-200 dark:bg-gray-800 h-[1px] w-full my-4"></div>

                      {/* Price */}
                      <div className="text-2xl lg:text-3xl font-customFont font-semibold dark:text-white text-black text-left mb-4">
                        {mounted ? price : ""}
                      </div>

                      {/* Footer Tag */}
                      <p className="text-gray-500 dark:text-gray-500 text-xs mb-6">{plan.footerText}</p>

                      {/* Highlight Bullets */}
                      <ul className="flex-1 space-y-3 text-left mb-8">
                        {plan.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start text-[13px] text-gray-700 dark:text-gray-400 space-x-2">
                            <FaIcons.FaCheck size={12} className="shrink-0 mt-1 text-orange" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Button
                        href={`/pricing/${plan.slug}`}
                        label="View Package"
                        variant={plan.id === 3 ? "primary" : "secondary"}
                        icon={MdArrowOutward}
                        className="w-full"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
