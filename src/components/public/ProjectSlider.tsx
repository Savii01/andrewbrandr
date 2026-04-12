"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { projects } from "@/data";

import Button from "./Button";

const ProjectSlider = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

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
    <div className="relative mx-auto py-6 px-6 lg:px-32 2xl:px-[350px] bg-white dark:bg-black text-center">
      <h1 className="text-center text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold text-black dark:text-white mb-6 leading-tight mt-10">
        Latest Works
      </h1>
      <p className="text-gray-800 dark:text-gray-200 text-[16px] mb-10 text-center">
        These are a few of my recent works, showcasing a blend of creativity and
        strategy.
      </p>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={2}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) => `
            <span class="${className} w-3 h-3 mx-1 rounded-full bg-gray-300 dark:bg-gray-500 transition-all duration-300 transform scale-100 hover:scale-125 inline-block cursor-pointer"></span>
          `,
        }}
        breakpoints={{
          1024: {
            slidesPerView: 1.4,
            spaceBetween: 1,
          },
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        className="w-full"
        onSlideChange={(swiper) => {
          swiper.slides.forEach((slide, index) => {
            if (index === swiper.activeIndex) {
              slide.style.opacity = "1";
              slide.style.transform = "scale(1)";
            } else {
              slide.style.opacity = "0.5";
              slide.style.transform = "scale(0.9)";
            }
          });
        }}
      >
        {projects.map((project) => (
          <SwiperSlide
            key={project.id}
            className="rounded-xl overflow-hidden transition-all duration-700 ease-in-out"
          >
            <div
              className="bg-gray-200 dark:bg-black border border-gray-400 dark:border-gray-600 cursor-grab hover:bg-gray-300 dark:hover:bg-lilBlack dark:text-white rounded-lg lg:rounded-3xl relative group"
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const btn = card.querySelector(".floating-btn") as HTMLElement;
                if (btn) {
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  btn.style.left = `${x}px`;
                  btn.style.top = `${y}px`;
                }
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget.querySelector(".floating-btn") as HTMLElement;
                if (btn) btn.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget.querySelector(".floating-btn") as HTMLElement;
                if (btn) btn.style.opacity = "0";
              }}
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-[250px] md:h-[500px] object-cover rounded-t-lg lg:rounded-t-3xl cursor-grabbing"
              />
              <div className="p-2 md:p-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-left">
                <h3 className="text-md font-bold text-black dark:text-white">{project.name}</h3>

                <div className="hidden md:flex flex-wrap gap-2">
                  {project.category.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 transition-transform duration-300 hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 🧭 Floating “View Project” button */}
                <Link
                  href={`/projects/${project.id}`}
                  className="floating-btn absolute z-50 px-4 py-2 bg-black text-white text-xs md:text-sm rounded-lg opacity-0 transition-all duration-200 ease-out transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 flex items-center justify-center whitespace-nowrap pointer-events-auto"
                >
                  View Project →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-10 lg:left-[10%] xl:left-[15%] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white w-10 h-10 rounded-lg z-10 flex items-center justify-center transition-all"
      >
        &#10094;
      </button>
      <button
        ref={nextRef}
        className="absolute right-10 lg:right-[10%] xl:right-[15%] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white w-10 h-10 rounded-lg z-10 flex items-center justify-center transition-all"
      >
        &#10095;
      </button>

      {/* Custom Pagination */}
      <div className="flex justify-center mt-6">
        <div className="custom-pagination flex justify-center items-center gap-2"></div>
      </div>

      {/* View All Projects Link */}
      <div className="flex justify-center mt-8">
        <Button
          href="/projects"
          label="View All Projects"
          variant="primary"
          icon={MdArrowOutward}
          fullWidth={false}
        />
      </div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet-active {
            background-color: #F23F03 !important;
            opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ProjectSlider;
