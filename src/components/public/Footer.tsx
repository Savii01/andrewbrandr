"use client";

import React from "react";
import Image from "next/image";
import { socialLinks } from "@/data";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBehance } from "react-icons/fa";

const iconMap: Record<string, any> = {
    FaFacebook: FaFacebook,
    FaLinkedin: FaLinkedin,
    FaTwitter: FaTwitter,
    FaInstagram: FaInstagram,
    FaBehance: FaBehance,
};

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black dark:bg-lilBlack dark:text-white py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start">

         {/* Footer Links */}
          <div className="flex flex-col gap-y-4 justify-start items-start order-2 md:order-1 mt-10 md:mt-0">

          <div className="flex flex-wrap lg:justify-center gap-4 mt-6 md:mt-0">
            <a href="/about" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange font-semibold transition">About</a>
            <a href="/services" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange font-semibold transition">Services</a>
            <a href="/projects" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange font-semibold transition">Projects</a>
            <a href="/send-message" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange font-semibold transition">Contact</a>
          </div>
          <div className="flex flex-wrap lg:justify-center gap-6 mt-2 md:mt-0">
            <a href="/terms" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange transition">Terms</a>
            <a href="/policy" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange transition">Policy</a>
            <a href="/refund" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange transition">Refund</a>
            <a href="/pricing" className="text-black dark:text-gray-300 hover:text-orange dark:hover:text-orange transition">Pricing</a>
          </div>
          </div>

          <div className="flex flex-col order-1 md:order-2">
            {/* Logo / Branding */}
            <div className="flex items-center gap-2">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black shrink-0">
                    <Image
                        src="/images/ig-profile.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="text-[16px] tracking-tighter font-bold md:text-[30px] dark:text-white text-black">
                   AndrewBrandr
                </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-[16px] md:text-[16px] text-left">
                I design systems that connect clarity<br/>  with Creativity.
            </p>
          </div>      

          {/* Social Icons */}
          <div className="flex gap-4 mt-6 md:mt-0 order-3">
            {socialLinks.map((link, i) => {
                const Icon = iconMap[link.icon];
                return (
                    <a 
                        key={i}
                        href={link.url} 
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-800 dark:text-gray-400 dark:hover:text-orange hover:text-orange transition text-xl"
                    >
                        <Icon />
                    </a>
                );
            })}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} AndrewBrandr. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
