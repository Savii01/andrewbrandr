"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pricingPlans } from "@/lib/pricingPlans";
import StepIndicator from "@/components/StepIndicator";
import OrderSummary from "@/components/OrderSummary";
import BriefForm from "@/components/BriefForm";
import LeadForm from "@/components/LeadForm";
import PaystackButton from "@/components/PaystackButton";
import Link from "next/link";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const STEPS = [
    { id: 1, title: "Brief", description: "Tell us about your project details." },
    { id: 2, title: "Account", description: "Login or create your account." },
    { id: 3, title: "Pricing", description: "Choose plan and add-ons." },
    { id: 4, title: "Payment", description: "Complete secure payment." }
];

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const planSlug = searchParams.get("plan");
    const isRetainerSelectedInitial = searchParams.get("retainer") === "true";

    const [currentStep, setCurrentStep] = useState(1);
    const [briefData, setBriefData] = useState<any>({ brandFeel: [], platforms: [] });
    const [leadData, setLeadData] = useState<any>({});
    const [isRetainerSelected, setIsRetainerSelected] = useState(isRetainerSelectedInitial);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const plan = pricingPlans.find(p => p.slug === planSlug) || pricingPlans[0];

    // Total logic for sidebar summary
    const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, "")) || 0;
    const totalAmount = parsePrice(plan.priceNGN) + (isRetainerSelected ? parsePrice(plan.retainer.priceNGN) : 0);

    const validateStep = () => {
        const newErrors: any = {};
        if (currentStep === 1) {
            if (!briefData.businessName) newErrors.businessName = "Required";
            if (plan.slug === "foundation") {
                if (!briefData.sellType) newErrors.sellType = "Required";
                if (!briefData.description) newErrors.description = "Required";
                if (!briefData.customerAge) newErrors.customerAge = "Required";
                if (!briefData.customerLocation) newErrors.customerLocation = "Required";
                if (!briefData.customerGender) newErrors.customerGender = "Required";
                if (!briefData.customerType) newErrors.customerType = "Required";
                if (briefData.industry === "other" && !briefData.otherIndustry) newErrors.otherIndustry = "Required";
                if (!briefData.industry) newErrors.industry = "Required";
            } else if (plan.slug === "clarity") {
                if (!briefData.duration) newErrors.duration = "Required";
                if (!briefData.logoFile) newErrors.logo = "Logo required";
                if (!briefData.currentCustomers) newErrors.currentCustomers = "Required";
            } else if (plan.slug === "scale") {
                if (!briefData.newMarkets) newErrors.newMarkets = "Required";
                if (!briefData.launchDate) newErrors.launchDate = "Required";
            } else if (plan.slug === "enterprise") {
                if (!briefData.description) newErrors.description = "Required";
                if (!briefData.teamSize) newErrors.teamSize = "Required";
            }
        } else if (currentStep === 2) {
            if (!leadData.fullName) newErrors.fullName = "Required";
            if (!leadData.email) newErrors.email = "Required";
            else if (!/^\S+@\S+\.\S+$/.test(leadData.email)) newErrors.email = "Invalid email";
            if (!leadData.source) newErrors.source = "Required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleEnterpriseSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        try {
            await fetch("/api/onboarding", {
                method: "POST",
                body: JSON.stringify({ plan: plan.slug, brief: briefData, lead: leadData }),
            });
            // Manual WhatsApp Redirection Option
            const text = `New Onboarding Brief (%2A${plan.title}%2A)%0A%0ABusiness: ${briefData.businessName}%0AName: ${leadData.fullName}%0AEmail: ${leadData.email}%0AIndustry: ${briefData.industry === 'other' ? briefData.otherIndustry : briefData.industry}`;
            router.push(`/thank-you?plan=${plan.slug}&whatsapp=${encodeURIComponent(text)}`);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = async (ref: string) => {
        setIsSubmitting(true);
        try {
            await fetch("/api/onboarding", {
                method: "POST",
                body: JSON.stringify({
                    plan: plan.slug,
                    retainer: isRetainerSelected,
                    brief: briefData,
                    lead: leadData,
                    paymentStatus: "paid",
                    paymentRef: ref
                }),
            });
            const text = `New Paid Order (%2A${plan.title}%2A)%0A%0ABusiness: ${briefData.businessName}%0AEmail: ${leadData.email}%0ARef: ${ref}`;
            router.push(`/thank-you?plan=${plan.slug}&retainer=${isRetainerSelected}&whatsapp=${encodeURIComponent(text)}`);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStepClick = (stepId: number) => {
        if (stepId < currentStep) {
            setCurrentStep(stepId);
            window.scrollTo(0, 0);
        } else if (stepId > currentStep) {
            if (validateStep()) {
                setCurrentStep(stepId);
                window.scrollTo(0, 0);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] px-6 md:px-16 py-8 md:py-12 2xl:px-60">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

                {/* SIDEBAR - Sticky Rounded Container */}
                <div className="w-full lg:w-[350px] xl:w-[400px] bg-[#0F0000] text-white p-6 lg:p-10 flex flex-col rounded-2xl border border-white/5 shadow-xl transition-all duration-500 shrink-0 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
                    {/* Logo */}
                    <div className="mb-10 shrink-0">
                        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-1">
                            andrew<span className="text-orange">brandr</span>
                        </Link>
                    </div>

                    {/* Step Indicator */}
                    <div className="mb-auto">
                        <StepIndicator
                            steps={plan.slug === "enterprise" ? STEPS.slice(0, 2) : STEPS}
                            currentStep={currentStep}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    {/* Sidebar Bottom: Summary & Security */}
                    <div className="mt-10 space-y-5 shrink-0">
                        {/* Summary Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                                <span className="text-gray-400 text-md font-bold">Plan selection</span>
                                <span className="text-white font-bold">{plan.priceNGN}</span>
                            </div>

                            {isRetainerSelected && (
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <span className="text-gray-400 text-md font-bold">Monthly retainer</span>
                                    <span className="text-white font-bold">{plan.retainer.priceNGN}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-md font-bold">Total amount</span>
                                <span className="text-white font-bold text-lg">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                                <FaShieldAlt size={14} className="text-orange" />
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-white">Secure checkout</p>
                                <p className="text-[10px] text-gray-500 font-medium">Your data is safe and secure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA - Natural Scrolling */}
                <div className="flex-1 bg-white p-6 md:p-10 lg:p-12 xl:p-16 rounded-2xl border border-gray-200">
                    <main className="max-w-xl mx-auto py-4">

                        {/* Page Header */}
                        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                            <h1 className="text-3xl font-customFont font-bold text-black mb-2 tracking-tighter">
                                {currentStep === 1 ? "Tell us about your business." :
                                    currentStep === 2 ? "A little bit about you." :
                                        currentStep === 3 ? "Pricing & Add-ons" :
                                            "Secure Payment"}
                            </h1>
                            <p className="text-gray-500 text-base font-medium">
                                {currentStep === 1 ? "Complete the brief in two pages before account setup." :
                                    currentStep === 2 ? "Provide your lead details for the project record." :
                                        currentStep === 3 ? "Confirm your package selection before payment." :
                                            "Finalize your project deposit."}
                            </p>
                        </div>

                        {/* Step Content Wrapper (Inner Flat Card) */}
                        <div className="bg-white border border-gray-50 rounded-2xl p-4 md:p-6 mb-8">
                            {currentStep === 1 && (
                                <BriefForm
                                    plan={plan.slug}
                                    data={briefData}
                                    onUpdate={setBriefData}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 2 && (
                                <LeadForm
                                    data={leadData}
                                    onUpdate={setLeadData}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in fade-in duration-700">
                                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mb-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-black font-bold text-base mb-1">Monthly strategy retainer</h4>
                                                <p className="text-gray-500 text-xs font-medium">Ongoing design support and strategy sessions</p>
                                            </div>
                                            <button
                                                onClick={() => setIsRetainerSelected(!isRetainerSelected)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isRetainerSelected ? 'bg-orange' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRetainerSelected ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <OrderSummary
                                        className="!bg-transparent !p-0"
                                        packageName={plan.subtitle}
                                        packagePrice={plan.priceNGN}
                                        retainerName={plan.retainer.title}
                                        retainerPrice={plan.retainer.priceNGN}
                                        isRetainerSelected={isRetainerSelected}
                                        showTotal={true}
                                    />
                                </div>
                            )}
                            {currentStep === 4 && (
                                <div className="space-y-8 animate-in fade-in duration-700">
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 text-[15px] leading-relaxed">
                                        "Ready to roll? Once payment is complete, you'll receive a confirmation email and we'll reach out within 24 hours to schedule our first strategy session."
                                    </div>
                                    <PaystackButton
                                        email={leadData.email}
                                        amount={totalAmount}
                                        onSuccess={handlePaymentSuccess}
                                        onClose={() => console.log("Payment closed")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-end items-center py-4">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="mr-8 text-[13px] font-bold text-gray-400 hover:text-black transition-colors tracking-widest"
                                >
                                    Back
                                </button>
                            )}

                            {currentStep < (plan.slug === "enterprise" ? 2 : 4) && (
                                <button
                                    onClick={handleNext}
                                    className="group inline-flex items-center gap-4 bg-[#0F140F] text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-orange hover:scale-105 active:scale-95 text-sm"
                                >
                                    CONTINUE
                                    <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            {currentStep === 2 && plan.slug === "enterprise" && (
                                <button
                                    onClick={handleEnterpriseSubmit}
                                    disabled={isSubmitting}
                                    className="group inline-flex items-center gap-4 bg-orange text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 text-sm"
                                >
                                    {isSubmitting ? "SENDING..." : "SEND BRIEF"}
                                    <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OnboardingContent />
        </Suspense>
    );
}
