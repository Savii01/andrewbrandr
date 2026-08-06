"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MdCheckCircle, MdArrowForward, MdCalendarToday } from "react-icons/md";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { pricingPlans } from "@/lib/pricingPlans";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "https://cal.com";
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const TG_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const planSlug = searchParams.get("plan");
    const retainerSelected = searchParams.get("retainer") === "true";
    const currency = (searchParams.get("currency") || "ngn") as "ngn" | "usd";
    const clientName = searchParams.get("clientName") || "there";
    const isEnterprise = searchParams.get("enterprise") === "true";

    const plan = pricingPlans.find(p => p.slug === planSlug) || pricingPlans[0];

    const waText = encodeURIComponent(
        `Hi, I just submitted my brief for the ${plan.title}. My name is ${clientName}. Please confirm receipt of my payment.`
    );
    const waLink = `https://wa.me/${WA_NUMBER}?text=${waText}`;
    const tgLink = `https://t.me/${TG_USERNAME}`;

    return (
        <div className="min-h-screen pt-32 bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-xl w-full animate-in fade-in zoom-in duration-700">

                {/* Check Icon */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <MdCheckCircle size={42} className="text-green-500" />
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-customFont font-bold text-black mb-4 tracking-tighter">
                    You're in, {clientName}.<br />Let's build something great.
                </h1>

                {/* Plan badge */}
                <div className="inline-block bg-orange/10 border border-orange/20 px-5 py-1.5 rounded-full mb-8 font-bold text-orange text-sm">
                    {plan.subtitle}
                </div>

                {/* Subtext */}
                <p className="text-gray-600 text-lg leading-relaxed mb-10">
                    {isEnterprise
                        ? "We've received your enterprise brief. We'll review it and reach out to schedule a discovery call."
                        : "We've received your brief and payment submission. We'll confirm and kick things off shortly."
                    }
                </p>

                {/* Steps */}
                <div className="text-left space-y-5 mb-10">
                    {/* Step 1 — Call booking */}
                    <div className="flex gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shrink-0 text-white text-sm font-bold">1</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-black mb-0.5">Book your 30-minute kickoff call</h4>
                            <p className="text-gray-500 text-sm mb-3">Pick a time that works. We'll review your brief and align before we start.</p>
                            <Link
                                href="/discovery"
                                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange transition-colors"
                            >
                                <MdCalendarToday size={15} />
                                Book a call
                            </Link>
                        </div>
                    </div>

                    {/* Step 2 — Payment confirmation */}
                    <div className="flex gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shrink-0 text-white text-sm font-bold">2</div>
                        <div>
                            <h4 className="font-bold text-black mb-0.5">We'll confirm your payment</h4>
                            <p className="text-gray-500 text-sm">
                                {currency === "ngn"
                                    ? "Once we verify your transfer, we'll reach out on WhatsApp within a few hours."
                                    : "Once your transfer arrives, we'll confirm via Telegram within 24 hours."
                                }
                            </p>
                        </div>
                    </div>

                    {/* Step 3 — Communication channel */}
                    <div className="flex gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shrink-0 text-white text-sm font-bold">3</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-black mb-0.5">Stay in touch</h4>
                            {currency === "ngn" ? (
                                <>
                                    <p className="text-gray-500 text-sm mb-3">Send your receipt on WhatsApp and we'll get right back to you.</p>
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        <FaWhatsapp size={16} />
                                        Send receipt on WhatsApp
                                    </a>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-sm mb-3">Find us on Telegram to confirm your transfer and coordinate your project.</p>
                                    <a
                                        href={tgLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        <FaTelegram size={16} />
                                        Message us on Telegram
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Retainer note */}
                {retainerSelected && (
                    <div className="bg-orange/5 border border-orange/10 rounded-2xl p-5 mb-8 text-sm text-gray-600 italic">
                        "Your monthly retainer has been noted. It begins after your project is delivered."
                    </div>
                )}

                {/* Footer note */}
                <p className="text-gray-400 text-sm mb-8">
                    Didn't receive confirmation? Reach out directly via{" "}
                    {currency === "ngn"
                        ? <a href={waLink} className="text-green-500 font-bold">WhatsApp</a>
                        : <a href={tgLink} className="text-blue-500 font-bold">Telegram</a>
                    }.
                </p>

                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors text-sm">
                    Return to site <MdArrowForward />
                </Link>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ThankYouContent />
        </Suspense>
    );
}
