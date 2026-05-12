"use client";

import React from 'react';

export default function SocialProofs() {
    return (
        <section className="bg-[#fdf3e6] flex justify-center px-4 pb-10 pt-10">
            <div className="max-w-[720px] w-full">
                {/* ── Social Proof Stats Row ── */}
                <div className="w-full py-6 border-y border-[#0F0000]/10 flex flex-row flex-wrap items-center justify-center gap-8 sm:gap-12">

                    <div className="flex flex-col items-start text-left">
                        <span className="text-[#0F0000] text-[20px] font-bold tracking-tight">26+</span>
                        <span className="text-[#0F0000]/90 text-[13px] mt-0.5">brands built</span>
                    </div>

                    <div className="w-1 h-1 bg-[#0F0000]/90 rounded-full"></div>

                    <div className="flex flex-col items-start text-left">
                        <span className="text-[#0F0000] text-[20px] font-bold tracking-tight">05+</span>
                        <span className="text-[#0F0000]/90 text-[13px] mt-0.5">years in the work</span>
                    </div>

                    <div className="w-1 h-1 bg-[#0F0000]/90 rounded-full"></div>

                    <div className="flex flex-col items-start text-left">
                        <span className="text-[#0F0000] text-[20px] font-bold tracking-tight">Global</span>
                        <span className="text-[#0F0000]/90 text-[13px] mt-0.5">Nigeria • UK • USA</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
