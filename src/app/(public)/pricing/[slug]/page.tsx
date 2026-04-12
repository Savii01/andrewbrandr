"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import { MdArrowOutward, MdArrowBack } from "react-icons/md";
import { pricingPlans } from "@/lib/pricingPlans";
import Button from "@/components/public/Button";
import Link from "next/link";
import OrderSummary from "@/components/OrderSummary";

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6 }
};

export default function PricingDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [isNigeria, setIsNigeria] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [retainerSelected, setRetainerSelected] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz === "Africa/Lagos") setIsNigeria(true);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const plan = pricingPlans.find((p) => p.slug === slug);
    if (!plan) return notFound();

    const price = mounted && isNigeria ? plan.priceNGN : plan.priceUSD;
    const retainerPrice = mounted && isNigeria ? plan.retainer.priceNGN : plan.retainer.priceUSD;

    // Construct final link for onboarding
    const finalLink = `/onboarding?plan=${plan.slug}&retainer=${retainerSelected}`;

    return (
        <div className="pt-32 bg-white dark:bg-black min-h-screen">
            <div className="px-6 lg:px-32 2xl:px-[260px] py-5">

                {/* Back Link */}
                <Link href="/pricing" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange transition-colors mb-12 text-sm">
                    <MdArrowBack size={18} />
                    Back to all packages
                </Link>

                {/* Hero */}
                <motion.div {...fadeInUp} className="mb-16">
                    <span className="text-lg border border-orange/10 font-bold text-orange inline-block bg-orange/10 px-3 py-1 rounded-md mb-4">
                        {plan.title}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-customFont font-bold text-black dark:text-white tracking-tighter leading-tight mb-6">
                        {plan.subtitle}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl leading-relaxed mb-8">
                        {plan.description}
                    </p>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-6xl font-customFont tracking-tighter font-bold text-black dark:text-white">
                            {mounted ? price : ""}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-lg">
                            {plan.footerText.split(" ").join(" || ")}
                        </span>
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="h-[1px] bg-gray-700 dark:bg-gray-800 mb-16"></div>

                {/* Sections Breakdown */}
                <motion.div {...fadeInUp} className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-customFont font-semibold text-black dark:text-white mb-10">
                        What&apos;s Included
                    </h2>
                    <div className="bg-white border border-black/30 dark:bg-lilBlack rounded-[2rem] p-2 lg:p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2">
                            {plan.sections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white dark:bg-lilBlack border border-black/30 dark:border-gray-700 rounded-3xl p-8 h-full ${plan.sections.length !== 4 && section.title.toLowerCase().includes("walk away with")
                                        ? "md:col-span-2"
                                        : "md:col-span-1"
                                        }`}
                                >
                                    <h3 className="text-lg font-bold text-black dark:text-white mb-5">{section.title}</h3>
                                    <ul className="space-y-4">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start text-lg text-gray-700 dark:text-gray-400 space-x-3">
                                                <FaIcons.FaCheck size={14} className="shrink-0 mt-1 text-orange" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Retainer Section */}
                <motion.div {...fadeInUp} className="mb-20">
                    <div className="bg-black dark:bg-lilBlack rounded-[2rem] p-2 lg:p-3">
                        <div
                            onClick={() => setRetainerSelected(!retainerSelected)}
                            className={`relative cursor-pointer transition-all duration-300 border bg-black dark:bg-lilBlack rounded-[28px] p-8 md:p-12 lg:p-16 text-white h-full ${retainerSelected
                                ? "border-orange shadow-[0_0_30px_rgba(255,102,0,0.2)]"
                                : "border-gray-700 dark:border-gray-600"
                                }`}
                        >
                            {/* Selection Indicator */}
                            <div className={`absolute top-8 right-8 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${retainerSelected
                                ? "bg-orange border-orange"
                                : "border-gray-600 bg-transparent"
                                }`}>
                                {retainerSelected && <FaIcons.FaCheck className="text-white" />}
                            </div>

                            <span className="text-lg border border-orange/10 font-bold text-orange inline-block bg-orange/20 px-3 py-1 rounded-md mb-6">
                                Keep Growing After Delivery
                            </span>
                            <div className="h-[1px] bg-gray-700 dark:bg-gray-800 my-8"></div>
                            <h2 className="text-2xl md:text-4xl font-customFont font-semibold mb-4 pr-12">
                                {plan.retainer.title}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                                After your project is delivered, stay consistent and keep growing with a monthly retainer plan tailored to your needs.
                            </p>
                            <div className="h-[1px] bg-gray-700 dark:bg-gray-800 mb-8"></div>
                            <div className="text-3xl md:text-4xl font-customFont font-semibold text-orange mb-8">
                                {mounted ? retainerPrice : ""}
                                <span className="text-gray-500 text-lg ml-3 font-normal">/month</span>
                            </div>
                            <div className="h-[1px] bg-gray-700 dark:bg-gray-800 mb-8"></div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {plan.retainer.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-lg text-gray-300 space-x-3">
                                        <FaIcons.FaCheck size={14} className="shrink-0 mt-1 text-orange" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 flex items-center gap-3">
                                <div className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${retainerSelected
                                    ? "bg-orange text-white"
                                    : "bg-gray-800 text-gray-400"
                                    }`}>
                                    {retainerSelected ? "Retainer Added" : "Click to Add to Package"}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeInUp} className="bg-black dark:bg-lilBlack/40 rounded-3xl p-8 md:p-16 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center gap-12 mt-20">
                    <div className="flex-1 w-full text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Order Summary</h3>
                        <p className="text-gray-400 mb-8 lowercase tracking-tighter">Your selected package and add-ons</p>
                        <OrderSummary
                            className="!border-none !bg-transparent !p-0"
                            packageName={plan.subtitle}
                            packagePrice={price}
                            retainerName={plan.retainer.title}
                            retainerPrice={retainerPrice}
                            isRetainerSelected={retainerSelected}
                            showTotal={true}
                        />
                    </div>

                    <div className="h-full w-[1px] bg-gray-700 dark:bg-gray-200"></div>
                    <div className="w-full md:w-auto shrink-0 flex flex-col items-center">
                        <Button
                            href={finalLink}
                            label="Get This Package"
                            variant="primary"
                            icon={MdArrowOutward}
                            className=""
                        />
                        <p className="text-lg text-gray-400 mt-6 font-medium text-center">
                            Next: Project Onboarding & Brief
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
