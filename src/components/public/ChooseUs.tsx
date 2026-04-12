"use client";

import React from 'react';
import * as FaIcons from "react-icons/fa";

export default function ChooseUs() {
  return (
    <div className="bg-white dark:bg-black">
      <div className="py-12 px-5 lg:px-36 my-10 flex flex-col justify-center gap-5 items-center text-center lg:text-left md:px-10 pb-20 md:pt-10 lg:flex-row lg:gap-[150px]">
        <div className="max-w-xl">
          <h1 className='font-customFont text-[24px] md:text-[36px] lg:text-[40px] font-semibold dark:text-white tracking-tighter mb-6 leading-tight text-center lg:text-left text-black'>
            Why I am Best Fit for You?
          </h1>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-3 text-left">
          <div className="p-6 bg-gray-50 dark:bg-lilBlack border border-gray-400 dark:border-gray-700 dark:border-2 rounded-2xl">
            <div className=" flex justify-between items-center mb-4">
              <FaIcons.FaChessKnight className="text-orange text-4xl mb-4" />
              <div className="bg-orange text-white rounded-lg px-4 py-2">1</div>
            </div>
            <div className="bg-gray-700 mb-4 w-full h-[1px]"></div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-200 font-customFont"> Creative + Strategic Thinking</h3>
            <p className="mt-2 text-gray-800 dark:text-white">
              I blend creativity with strategy to craft designs that not only look
              stunning but also drive real results for your business.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-lilBlack border border-gray-400 dark:border-gray-700 dark:border-2 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <FaIcons.FaMagic className="text-orange text-4xl mb-4" />
              <div className="bg-orange text-white rounded-lg px-4 py-2">2</div>
            </div>
            <div className="bg-gray-700 mb-4 w-full h-[1px]"></div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-200 font-customFont">Tailored to Fit</h3>
            <p className="mt-2 text-gray-800 dark:text-white">No templates. No copy-paste. Every project is crafted around your brand’s unique vibe and goals.</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-lilBlack border border-gray-400 dark:border-gray-700 dark:border-2 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <FaIcons.FaCheckCircle className="text-orange text-4xl mb-4" />
              <div className="bg-orange text-white rounded-lg px-4 py-2 mt-2">3</div>
            </div>
            <div className="bg-gray-700 mb-4 w-full h-[1px]"></div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-200 font-customFont">Fast, Not Rushed</h3>
            <p className="mt-2 text-gray-800 dark:text-white">
              From Design and Development to Delivery, I work efficiently to meet your deadlines without ever compromising on quality.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-lilBlack border border-gray-400 dark:border-gray-700 dark:border-2 rounded-2xl">
            <div className=" flex justify-between items-center mb-4">
              <FaIcons.FaUserCheck className="text-orange text-4xl mb-4" />
              <div className="bg-orange text-white rounded-lg px-4 py-2">4</div>
            </div>
            <div className="bg-gray-700 mb-4 w-full h-[1px]"></div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-200 font-customFont">You-First Process</h3>
            <p className="mt-2 text-gray-800 dark:text-white">We listen before we design. Your vision guides the process; our expertise brings it to life.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
