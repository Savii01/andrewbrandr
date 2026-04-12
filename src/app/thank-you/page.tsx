"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { pricingPlans } from "@/lib/pricingPlans";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const planSlug = searchParams.get("plan");
    const retainerSelected = searchParams.get("retainer") === "true";
    const whatsappText = searchParams.get("whatsapp");

    const plan = pricingPlans.find(p => p.slug === planSlug) || pricingPlans[0];
    const whatsappLink = `https://wa.me/234XXXXXXXXXX?text=${whatsappText}`; // Replace with your number

    return (
        <div className="min-h-screen pt-32 bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10">
                    <MdCheckCircle size={48} className="text-green-500" />
                </div>

                <h1 className="text-4xl md:text-6xl font-customFont font-bold text-black mb-6 tracking-tighter">
                    {whatsappText ? "Final step to get started." : "You're in. Let's build something great."}
                </h1>

                <div className="inline-block bg-orange/10 border border-orange/20 px-6 py-2 rounded-full mb-10 font-bold text-orange uppercase tracking-widest text-sm">
                    {plan.subtitle}
                </div>

                <p className="text-gray-600 text-xl leading-relaxed mb-12">
                    {whatsappText
                        ? "Your brief has been prepared! Click the button below to send it to us on WhatsApp and start the conversation immediately."
                        : "We've received your brief and your payment. You'll hear from us within 24 hours via email to kick things off and schedule our discovery session."}
                </p>

                {whatsappText ? (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 mb-12"
                    >
                        <FaWhatsapp size={24} />
                        FINISH IN WHATSAPP
                    </a>
                ) : retainerSelected && (
                    <div className="bg-gray-50 p-6 rounded-2xl mb-12 border border-gray-100">
                        <p className="text-black font-bold mb-1 italic">
                            &quot;Your monthly retainer has also been noted and will begin after your project is delivered.&quot;
                        </p>
                    </div>
                )}

                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors uppercase tracking-widest text-sm">
                        Return to site
                        <MdArrowForward />
                    </Link>
                </div>
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
