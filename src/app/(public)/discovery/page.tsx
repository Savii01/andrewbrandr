"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CalendarWidget from "@/components/public/CalendarWidget";
import { FiArrowRight, FiCheck, FiDribbble, FiLinkedin, FiMail, FiMessageSquare } from "react-icons/fi";
import { FaBehance, FaTelegram, FaWhatsapp } from "react-icons/fa";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2347012636013";
const TG_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "saviiandrew";

export default function DiscoveryPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-[#0F0000] text-[#fdf3e6] relative overflow-hidden selection:bg-[#CC3300] selection:text-white">
            
            {/* Background luxury gradient glow */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#CC3300]/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full bg-[#CC3300]/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* LEFT COLUMN: Copywriting & High Impact Links */}
                    <div className="lg:col-span-5 flex flex-col items-start text-left">
                        
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block bg-[#CC3300]/10 border border-[#CC3300]/30 text-orange font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6"
                        >
                            Discovery & Strategy Call
                        </motion.span>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.05] mb-6 text-white"
                        >
                            Let's align your brand goals.
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/70 text-base sm:text-lg leading-relaxed mb-8"
                        >
                            Book a direct 30-minute kickoff and strategy session. We will examine your market positioning, research competitor design vectors, and map out a structured roadmap to transform your brand identity.
                        </motion.p>

                        {/* Checklist */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4 mb-10 w-full"
                        >
                            {[
                                "30-minute direct session with Saviour",
                                "Identify market positioning opportunities",
                                "Explore design and visual vectors checklist"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-orange/15 border border-orange/30 flex items-center justify-center shrink-0">
                                        <FiCheck className="text-orange" size={12} />
                                    </div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* See Pricing CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center gap-3 mb-12"
                        >
                            <Link 
                                href="/#pricing" 
                                className="group inline-flex items-center gap-2 text-sm font-bold text-orange hover:text-white transition-colors"
                            >
                                View Investment Packages 
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="h-[1px] bg-white/10 w-full mb-8" />

                        {/* Social profiles & alternate communication links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col gap-4 text-left"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                Direct Contact & Portfolios
                            </span>
                            <div className="flex flex-wrap gap-4">
                                <a 
                                    href={`https://wa.me/${WA_NUMBER}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/5 hover:bg-[#25D366]/10 border border-white/10 hover:border-[#25D366]/30 text-white/70 hover:text-[#25D366] rounded-xl transition-all"
                                    title="WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </a>
                                <a 
                                    href={`https://t.me/${TG_USERNAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/5 hover:bg-[#0088cc]/10 border border-white/10 hover:border-[#0088cc]/30 text-white/70 hover:text-[#0088cc] rounded-xl transition-all"
                                    title="Telegram"
                                >
                                    <FaTelegram size={18} />
                                </a>
                                <a 
                                    href="https://www.behance.net/saviourandrew"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/5 hover:bg-[#0057ff]/10 border border-white/10 hover:border-[#0057ff]/30 text-white/70 hover:text-[#0057ff] rounded-xl transition-all"
                                    title="Behance"
                                >
                                    <FaBehance size={18} />
                                </a>
                            </div>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: Calendar Widget panel */}
                    <div className="lg:col-span-7 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full relative"
                        >
                            {/* Visual elevated card border accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange/10 to-transparent rounded-[2rem] -m-0.5 pointer-events-none blur-[1px]" />
                            <CalendarWidget />
                        </motion.div>
                    </div>

                </div>
            </div>

        </div>
    );
}
