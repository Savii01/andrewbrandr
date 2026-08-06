"use client";

import React from "react";
import Image from "next/image";
import { socialLinks } from "@/data";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBehance } from "react-icons/fa";

import { getSiteContent } from "@/lib/firebase/cms";

const iconMap: Record<string, any> = {
    FaFacebook: FaFacebook,
    FaLinkedin: FaLinkedin,
    FaTwitter: FaTwitter,
    FaInstagram: FaInstagram,
    FaBehance: FaBehance,
};

const Footer = () => {
  const [footerData, setFooterData] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadFooter() {
      const content = await getSiteContent();
      if (content?.footer) {
        setFooterData(content.footer);
      }
    }
    loadFooter();
  }, []);

  const tagline = footerData?.tagline || "I design systems that connect clarity\n with Creativity.";
  const links = footerData?.links || [
    { label: "About", href: "/#about" },
    { label: "Process", href: "/#process" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/send-message" }
  ];
  const policyLinks = footerData?.policyLinks || [
    { label: "Terms", href: "/terms" },
    { label: "Policy", href: "/policy" },
    { label: "Refund", href: "/refund" },
    { label: "Stages", href: "/#stages" }
  ];

  return (
    <footer className="bg-[#0F0000] text-[#fdf3e6] py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start">

         {/* Footer Links */}
          <div className="flex flex-col gap-y-4 justify-start items-start order-2 md:order-1 mt-10 md:mt-0">

          <div className="flex flex-wrap lg:justify-center gap-4 mt-6 md:mt-0">
            {links.map((link: any, idx: number) => (
              <a key={idx} href={link.href} className="text-white/70 hover:text-orange font-semibold transition">{link.label}</a>
            ))}
          </div>
          <div className="flex flex-wrap lg:justify-center gap-6 mt-2 md:mt-0">
            {policyLinks.map((link: any, idx: number) => (
              <a key={idx} href={link.href} className="text-white/70 hover:text-orange transition">{link.label}</a>
            ))}
          </div>
          </div>

          <div className="flex flex-col order-1 md:order-2">
            {/* Logo / Branding */}
            <div className="flex items-center gap-2">
                <div className="relative w-40 h-10 shrink-0">
                    <Image
                        src="/brand_assets/secondary_logo_white_svg.svg"
                        alt="AndrewBrandr"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <p className="text-white/60 mt-2 text-[16px] md:text-[16px] text-left whitespace-pre-line">
                {tagline}
            </p>
          </div>      

          {/* Social Icons */}
          <div className="flex gap-4 mt-6 md:mt-0 order-3">
            {socialLinks.map((link, i) => {
                const Icon = iconMap[link.icon];
                if (!Icon) return null;
                return (
                    <a 
                        key={i}
                        href={link.url} 
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/60 hover:text-orange transition text-xl"
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
