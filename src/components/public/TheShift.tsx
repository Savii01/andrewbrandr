"use client";

import React from "react";

export default function TheShift({ cmsData }: { cmsData?: any }) {
    const defaultParagraphs = "Brands aren’t built in pieces.\n\nFor years, businesses hired designers one task at a time.\n\nA logo here. A flyer there. A website later.\n\nIt works for a moment. But growth exposes the cracks. Inconsistency. Mixed messaging. A brand that doesn’t feel whole.\n\nSo I stopped offering services individually.\n\nNow everything is built in stages. Each stage meets your business where it is and prepares it for where it’s going.\n\nNo fragmentation. No guesswork. Just structure.";
    const text = cmsData?.paragraphs || defaultParagraphs;
    const paragraphs = text.split('\n\n');

    return (
        <section className="bg-[#fdf3e6] px-4 py-32 md:py-24 flex justify-center">
            <div className="max-w-[720px] w-full flex flex-col items-start text-left gap-1 md:gap-2">
                {paragraphs.map((p: string, i: number) => (
                    <p key={i} className="text-[#0F0000] text-[20px] sm:text-[24px] md:text-[24px] font-medium leading-[1.7] tracking-tight">
                        {p}
                    </p>
                ))}
            </div>
        </section>
    );
}
