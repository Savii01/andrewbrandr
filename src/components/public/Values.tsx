"use client";

import React from 'react';

function Values() {
  const valuesData = [
    {
      title: "Transparency",
      description: "We are committed to being straightforward, honest, and transparent in all aspects of our service and operations.",
    },
    {
      title: "Client-Centric Approach",
      description: "Our process revolves around understanding our clients' needs and providing tailored design solutions that drive success.",
    },
    {
      title: "Strategic Excellence",
      description: "We blend creativity with strategy to craft designs that are not just beautiful but also effective in achieving business goals.",
    },
    {
      title: "Creative Team",
      description: "Our team of designers constantly innovate to bring the best creative experience for your brand.",
    },
    {
      title: "Authentic Collaboration",
      description: "We work closely with our clients, valuing transparency, trust, and teamwork to create designs that truly resonate.",
    },
    {
      title: "Creativity & Innovation",
      description: "We push boundaries to deliver visually striking and original designs that leave a lasting impact.",
    },
  ];

  return (
    <div className="lg:px-[40px] px-5 flex flex-col justify-center items-center text-left md:text-center py-24 bg-gray-100 dark:bg-black">
      <div className="flex flex-col items-center gap-2 mb-8 xl:mb-14">
        <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
          • Value
        </span>
        <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-6 leading-tight">
          Things I Believe In
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-[16px] max-w-2xl text-center">
          These are the core principles that guide my work and define who I am as a designer.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:mx-40 gap-6">
        {valuesData.map((value, i) => (
          <div key={i} className="bg-white dark:bg-lilBlack dark:hover:bg-[#1E1E1E] hover:bg-gray-50 p-6 py-10 rounded-2xl border border-gray-400 dark:border-gray-700 transition-all">
            <h3 className="text-2xl font-semibold dark:text-gray-200 text-left text-gray-800">{value.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-left">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Values;
