"use client";

import { useParams } from "next/navigation";
import { usePortalEngagement, getMacroProgress } from "@/lib/hooks/useDashboardData";
import { STAGE_CONFIG } from "@/lib/stage-config";
import { motion, AnimatePresence } from "framer-motion";
import { FiLayout, FiExternalLink, FiDownload } from "react-icons/fi";
import StageView from "@/components/dashboard/engagement/StageView";
import Image from "next/image";

export default function ClientPortalPage() {
    const { token } = useParams();
    const { engagement, loading } = usePortalEngagement(token as string);

    if (loading) return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-6">
                <Image 
                    src="/brand_assets/secondary_logo_black_svg.svg" 
                    alt="AndrewBrandr" 
                    width={180} 
                    height={40} 
                    className="animate-pulse"
                />
                <div className="w-12 h-[1px] bg-orange animate-width-grow" />
                <p className="text-xs font-bold text-gray-400">Securing Studio Session...</p>
             </div>
        </div>
    );

    if (!engagement) return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-6">
                <h1 className="text-2xl font-display">Session Expired or Invalid</h1>
                <p className="text-gray-500 text-sm">Please contact AndrewBrandr Studio for a valid access link to your brand room.</p>
            </div>
        </div>
    );

    const progress = getMacroProgress(engagement);

    return (
        <div className="min-h-screen bg-[#FDF3E6]">
            {/* High-End Portal Header */}
            <header className="sticky top-0 z-40 w-full bg-[#FDF3E6]/80 backdrop-blur-xl border-b border-[#0F0000]/5 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Image 
                            src="/brand_assets/secondary_logo_black_svg.svg" 
                            alt="AndrewBrandr" 
                            width={140} 
                            height={30} 
                        />
                        <div className="h-6 w-[1px] bg-[#0F0000]/10" />
                        <div>
                            <p className="text-sm font-black text-[#0F0000]/40 mb-0.5">BRAND ROOM</p>
                            <h2 className="text-base font-black text-[#0F0000]">{engagement.projectName}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 px-6 py-2 rounded-2xl bg-[#0F0000]/5 border border-[#0F0000]/5">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-black text-[#0F0000]/40 uppercase">Efficiency</p>
                                <p className="text-sm font-black text-[#0F0000]">{progress}%</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#0F0000]/10 flex items-center justify-center relative">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        className="text-[#0F0000]/5"
                                    />
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray={88}
                                        strokeDashoffset={88 - (88 * progress) / 100}
                                        className="text-orange"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#0F0000]">
                                    {Object.values(engagement.stages).filter(s => s.status === "completed").length}
                                </span>
                            </div>
                        </div>
                        
                        <a href="mailto:hello@andrewbrandr.com" className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#0F0000] text-white text-sm font-black rounded-xl hover:bg-orange transition-all shadow-xl shadow-[#0F0000]/10">
                             Studio Chat
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12">
                {/* Active Stage Indicator */}
                <div className="px-8 mb-12">
                    <div className="p-10 rounded-[3rem] bg-[#0F0000] text-white flex flex-col md:flex-row md:items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-[#0F0000]/20">
                        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-br from-orange/20 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-orange text-white text-xs font-black uppercase">ACTIVE PHASE</span>
                                <span className="text-white/20 font-black">/</span>
                                <span className="text-white/40 text-xs font-black uppercase">{STAGE_CONFIG[engagement.stagePrimary].label}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black font-display mb-6 leading-tight">
                                The studio is currently focused on <span className="text-orange underline decoration-orange/30 underline-offset-8">{STAGE_CONFIG[engagement.stagePrimary].label}</span>
                            </h1>
                            <p className="text-white/50 text-lg max-w-xl leading-relaxed font-bold">
                                {STAGE_CONFIG[engagement.stagePrimary].description}
                            </p>
                        </div>
                        <div className="relative z-10 shrink-0">
                             <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl w-full md:w-80">
                                <p className="text-xs font-black text-orange mb-4">LIVE OUTCOME</p>
                                <p className="text-base font-black text-white/90 leading-relaxed italic">
                                    "Drafting the primary brand architecture and strategic identity markers for high-growth positioning."
                                </p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Workspace Content */}
                <div className="px-8">
                     <div className="bg-white rounded-[3rem] border border-[#0F0000]/5 shadow-2xl shadow-[#0F0000]/5 overflow-hidden">
                         <StageView engagement={engagement} stageKey={engagement.stagePrimary} isClient={true} />
                     </div>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-8 py-16 border-t border-[#0F0000]/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                         <Image 
                            src="/brand_assets/secondary_logo_black_svg.svg" 
                            alt="AndrewBrandr" 
                            width={100} 
                            height={20} 
                            className="opacity-20"
                        />
                        <p className="text-xs font-black text-[#0F0000]/30 uppercase">Studio &copy; 2026 — All Rights Reserved</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-black text-[#0F0000]/40 hover:text-[#0F0000] uppercase transition-colors">Privacy</a>
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-black text-[#0F0000]/40 hover:text-[#0F0000] uppercase transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
