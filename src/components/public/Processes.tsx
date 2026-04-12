"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import Button from "./Button";

const stages = [
  {
    number: 1,
    title: "Send A Message",
    description:
      "You can reach out to me via the contact form, email, or social media. I'm here to discuss your project, answer questions, and explore how we can work together to bring your vision to life.",
    tags: ["Free Consultation", "Quick Response"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  },
  {
    number: 2,
    title: "Brief | Strategy | Planning",
    description:
      "We'll kick things off with a detailed discussion about your project. I'll gather insights about your goals, target audience, and design preferences.",
    tags: ["Comprehensive Consultation", "Project Roadmap"],
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200",
  },
  {
    number: 3,
    title: "Design | Development",
    description:
      "I'll create initial design concepts based on our discussions. We'll collaborate closely, refining through feedback and iterations.",
    tags: ["Seamless Integration", "Real Time Collaboration"],
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200",
  },
  {
    number: 4,
    title: "Delivery | Launch | Growth",
    description:
      "Once the designs are finalized, I'll prepare all necessary files and assets for delivery. If it's a web project, I'll assist with deployment and launch.",
    tags: ["Ongoing Support", "Documentation"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    cta: true,
  },
];

function Processes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  // INTERSECTION OBSERVER
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          threshold: 0.7,
          rootMargin: "-80px 0px -20% 0px",
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section className="bg-white dark:bg-black py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
            • How We Work
          </span>

          <h2 className="font-customFont text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-semibold tracking-tighter mb-6 leading-tight">
            We Simplify The Journey
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              From Design To Launch.
            </span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
            A simplified, results-oriented workflow designed to keep us aligned
            from the first strategy call to the final launch and beyond.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT SIDE — STACKING CARDS */}
          <div className="relative pb-[60vh]">
            {stages.map((stage, index) => (
              <div
                key={stage.number}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                className="sticky top-28 mb-10"
                style={{
                  marginTop: index === 0 ? "0px" : `${index * 24}px`,
                  zIndex: index + 1,
                }}
              >
                <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-lilBlack p-6 md:p-10 lg:p-12 transition-all duration-500">

                  {/* Stage */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-orange">
                      Stage {stage.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-md md:text-lg lg:text-xl font-semibold text-black dark:text-[#FFF1E3] tracking-tighter leading-[1.2]">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed max-w-lg">
                    {stage.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 pt-6">
                    {stage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[13px] font-medium px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {stage.cta && (
                    <div className="pt-8">
                      <Button
                        href="/send-message"
                        label="Send a Message"
                        variant="primary"
                        icon={MdArrowOutward}
                        fullWidth={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE — STICKY IMAGE */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 h-[calc(100vh-8rem)] p-4 border border-gray-200 dark:border-white/10 rounded-[32px] bg-gray-50/50 dark:bg-white/5">

              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">

                {/* IMAGES STACKED */}
                {stages.map((stage, index) => (
                  <img
                    key={index}
                    src={stage.image}
                    alt={stage.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${activeIndex === index
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                      }`}
                  />
                ))}

              </div>

            </div>
          </div>

        </div>

        {/* MOBILE FALLBACK */}
        <div className="lg:hidden mt-16 space-y-10">
          {stages.map((stage) => (
            <div key={stage.number} className="space-y-4">
              <div className="relative w-full h-[250px] rounded-xl overflow-hidden">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Processes;