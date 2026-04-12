"use client";

import React from "react";
import Button from "./Button";
import { MdArrowOutward } from "react-icons/md";

export default function Hero() {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center py-4 px-4 bg-white dark:bg-black overflow-hidden">

      <div className="relative z-10 flex flex-col gap-6 items-center text-center max-w-4xl px-4 md:px-6 w-full">
        {/* Availability Badge */}
        <div className="animate-pulse flex justify-center items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-1.5 rounded-lg">
          <div className="bg-orange rounded-full w-2 h-2"></div>
          <p className="text-black dark:text-gray-300 text-[12px] md:text-[14px] font-medium tracking-wide">
            Available for work
          </p>
        </div>

        {/* Static Header */}
        <h1 className="text-[40px] lg:text-center font-semibold sm:text-[60px] md:text-[60px] leading-[1.1] tracking-tighter max-w-[100%] md:max-w-[800px] animate-fadeIn text-black dark:text-white">
          Logos are easy.<br />
          Clarity is the hard part.

        </h1>

        {/* Subtext */}
        <p className="text-[16px] lg:text-center sm:text-[18px] max-w-xs sm:max-w-2xl md:max-w-xl text-gray-700 dark:text-white leading-relaxed">
          I design brand systems that help companies communicate clearly,
          stay consistent, and grow with confidence. Brand identity, digital
          design, and web systems — built to work together.
        </p>

        {/* Buttons */}
        <div className="flex sm:flex-row flex-col gap-5 mt-5 w-full sm:w-auto">
          <Button
            href="/send-message"
            label="Send a Message"
            variant="primary"
            icon={MdArrowOutward}
          />
          <Button
            href="/projects"
            label="See Projects"
            variant="secondary"
            icon={MdArrowOutward}
          />
        </div>
      </div>
    </div>
  );
}