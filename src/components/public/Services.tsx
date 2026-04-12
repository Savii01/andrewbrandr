"use client";

import React from 'react';
import Link from 'next/link';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import Button from './Button';
import { MdArrowOutward } from 'react-icons/md';

function Services() {
  return (
    <div className='bg-white dark:bg-black'>
      <div className="text-black dark:text-white flex flex-col justify-center items-center text-center mt-10 md:px-4 pb-20 md:pt-10">
        <div className="flex flex-col items-center gap-2 mb-8 xl:mb-16">
          <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
            • My Services
          </span>
          <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-6 leading-tight">
            What I do,<span className="text-gray-600 dark:text-gray-400"> Best</span>
          </h1>
          <p className="mx-4">
            These are the services I offer
            to help your business grow and succeed in today&apos;s competitive market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 mx-5 lg:mx-24">
          {/* Brand Designs */}
          <div className="bg-white dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-lilBlack flex flex-col border border-gray-400 dark:border-gray-700 py-8 rounded-3xl px-5 transition-all">
            {/* Icon */}
            <div className="flex justify-between items-center">
              <FaIcons.FaPenNib className="w-[32px] h-[32px] text-orange" />
              <div className="bg-orange text-white rounded-full px-4 py-2 ">1</div>
            </div>
            <div className="bg-gray-200 w-full h-[1px] my-8 dark:bg-gray-700"></div>
            <div className="text-left mt-3 flex flex-col gap-y-2">
              <h1 className="text-[18px] font-semibold tracking-tight text-black dark:text-white">
                Brand Designs
              </h1>
              <p className="text-[16px] text-black dark:text-gray-300">
                I don’t just design logos — I build full brand identities that tell your story, earn trust, and make you unforgettable.<br />
              </p>
              <span className="bg-orange/5 dark:bg-orange/50 text-black dark:text-white rounded-lg px-4 py-2 mt-3 text-sm">→ Think strategy, style, and soul — all in one.</span>
            </div>
          </div>

          {/* social Media*/}
          <div className="bg-white dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-lilBlack flex flex-col border border-gray-400 dark:border-gray-700 py-8 rounded-3xl px-5 transition-all">
            {/* Icon */}
            <div className="flex justify-between items-center">
              <FaIcons.FaMobileAlt className="w-[32px] h-[32px] text-orange" />
              <div className="bg-orange text-white rounded-full px-4 py-2 ">2</div>
            </div>
            <div className="bg-gray-200 w-full h-[1px] my-8 dark:bg-gray-700"></div>
            <div className="text-left mt-3 flex flex-col gap-y-2">
              <h1 className="text-[18px] font-semibold tracking-tight text-black dark:text-white">
                Social Media Designs
              </h1>
              <p className="text-[16px] text-black dark:text-gray-300">
                Custom visuals that make your feed stop the scroll and speak your vibe. From content kits to cohesive grids, I help you show up consistently and creatively.<br />
              </p>
              <span className="bg-orange/5 dark:bg-orange/50 text-black dark:text-white rounded-lg px-4 py-2 mt-3 text-sm">→ Build community. Boost engagement. Stay branded.</span>
            </div>
          </div>

          {/* Web Development */}
          <div className="bg-white dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-lilBlack flex flex-col border dark:border border-gray-400 dark:border-gray-700 py-8 rounded-3xl px-5 transition-all">
            {/* Icon */}
            <div className=" flex justify-between items-center">
              <BsIcons.BsGlobe className="w-[32px] h-[32px] text-orange" />
              <div className="bg-orange text-white rounded-full px-4 py-2 ">3</div>
            </div>
            <div className="bg-gray-200 w-full h-[1px] my-8 dark:bg-gray-700"></div>
            <div className="text-left mt-3 flex flex-col gap-y-2">
              <h1 className="text-[18px] font-semibold tracking-tight text-black dark:text-white">
                Web Development
              </h1>
              <p className="text-[16px] text-black dark:text-gray-300">
                Responsive, clean, and coded to convert. I build websites that aren’t just pretty — they perform.<br />
              </p>
              <span className="bg-orange/5 dark:bg-orange/50 text-black dark:text-white rounded-lg px-4 py-2 mt-3 text-sm">→ Sleek UX. Smart structure. Real results.</span>
            </div>
          </div>
        </div>
        <Button
          href="/send-message"
          label="Send A Message"
          variant="orange"
          icon={MdArrowOutward}
          className="mt-10"
        />
      </div>
    </div>
  );
}

export default Services;
