"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack, MdCheck, MdArrowOutward } from "react-icons/md";
import { getSiteContent } from "@/lib/firebase/cms";
import { pricingPlans as defaultPlans } from "@/lib/pricingPlans";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import QualificationForm from "@/components/public/QualificationForm";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
};

type ViewState = "DETAILS" | "FORM" | "CONFIRMATION";

export default function PricingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const [isNigeria, setIsNigeria] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("DETAILS");
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Africa/Lagos") setIsNigeria(true);
    } catch (e) {
      console.error(e);
    }

    async function loadCMS() {
      const data = await getSiteContent();
      setCmsData(data);
      setLoading(false);
    }
    loadCMS();
  }, []);

  const plans = cmsData?.pricing?.plans || defaultPlans;
  const plan = plans.find((p: any) => p.slug === slug);
  const [submittingBrief, setSubmittingBrief] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setSubmittingBrief(true);
    try {
      if (db && plan) {
        const { collection, addDoc } = await import("firebase/firestore");
        await addDoc(collection(db, "briefs"), {
          plan: plan.slug,
          status: "pending",
          createdAt: new Date(),
          lead: {
            fullName: formData.name || "",
            email: formData.email || "",
            country: formData.country || "",
            comm_pref: formData.comm_pref || "Email",
            whatsapp: formData.whatsapp || "",
            telegram: formData.telegram || "",
            currency: isNigeria ? "ngn" : "usd"
          },
          brief: {
            businessName: formData.business || formData.org || "Unnamed Business",
            selling: formData.selling || "",
            description: formData.description || formData.trigger || formData.outcome || "",
            target: formData.target || "",
            vibe: formData.vibe || [],
            timeline: formData.timeline || "",
            ...formData
          }
        });
      }
      setViewState("CONFIRMATION");
    } catch (error) {
      console.error("Error submitting brief to Firestore:", error);
      alert("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmittingBrief(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF3E6]">
        <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) return notFound();

  // Price calculations
  const price = mounted && isNigeria 
    ? (plan.investment?.priceNGN || plan.priceNGN) 
    : (plan.investment?.priceUSD || plan.priceUSD);

  const stage = plan.stage || `Stage 0${plan.id || 1}`;
  const subtitle = plan.subtitle || "";
  const titleText = plan.title || "";
  const headerDescription = plan.description || "";
  const highlights = plan.highlights || plan.whoThisIsFor || [];
  const sectionsList = plan.sections || [];
  const timelineText = plan.timeline || "4 Weeks";
  const investmentDetails = plan.footerText || plan.investment?.details || "Tailored strategic delivery.";
  const walkAwayList = plan.whatYouWalkAwayWith || plan.highlights || [];
  const discoveryIntro = plan.discoveryIntro || "Apply below and we will get back to you with next steps.";

  if (!mounted) return null;

  return (
    <div className="pt-32 bg-[#FDF3E6] min-h-screen pb-20 selection:bg-[#CC3300] selection:text-white">
      <div className="max-w-[720px] mx-auto px-6">
        
        {/* Back Link */}
        <Link 
          href="/#pricing" 
          className="inline-flex items-center gap-2 text-[#0F0000]/60 hover:text-[#CC3300] transition-colors mb-16 text-sm font-bold uppercase tracking-widest"
        >
          <MdArrowBack size={18} />
          Back to all stages
        </Link>

        <AnimatePresence mode="wait">
          {viewState === "DETAILS" && (
            <motion.div 
              key="stage-details"
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20 }}
              variants={fadeInUp}
            >
              {/* Stage Header */}
              <div className="mb-20">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-4">
                  <span className="text-[#CC3300] font-bold text-xl block">
                    {stage} — {subtitle}
                  </span>

                  {/* Currency Toggle */}
                  <div className="flex items-center bg-[#0f0000]/5 p-1 rounded-full border border-[#0f0000]/10 shrink-0">
                    <button
                      onClick={() => setIsNigeria(true)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                        isNigeria 
                        ? "bg-[#0f0000] text-white shadow-lg" 
                        : "text-[#0f0000]/40 hover:text-[#0f0000]"
                      }`}
                    >
                      NGN
                    </button>
                    <button
                      onClick={() => setIsNigeria(false)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                        !isNigeria 
                        ? "bg-[#0f0000] text-white shadow-lg" 
                        : "text-[#0f0000]/40 hover:text-[#0f0000]"
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <h1 className="text-[42px] md:text-[40px] font-extrabold text-[#0F0000] mb-8 tracking-tight">
                  {titleText}
                </h1>
                
                <div className="space-y-6 text-[#0F0000] text-[18px] md:text-[21px] leading-[1.3] font-medium">
                  {headerDescription.split('. ').filter(Boolean).map((sentence: string, i: number) => (
                    <p key={i}>{sentence.trim()}.</p>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-[#0F0000]/10 flex flex-wrap gap-8">
                   <div>
                     <p className="text-[11px] font-bold uppercase tracking-widest text-[#0F0000]/40 mb-1">Investment</p>
                     <p className="text-2xl font-black text-[#0F0000]">{price}</p>
                   </div>
                   <div>
                     <p className="text-[11px] font-bold uppercase tracking-widest text-[#0F0000]/40 mb-1">Focus</p>
                     <p className="text-2xl font-black text-[#0F0000]">{plan.slugText || plan.slug || ""}</p>
                   </div>
                </div>
              </div>

              <hr className="border-[#0F0000]/10 mb-20" />

              {/* Who this is for */}
              <section className="mb-24">
                <h2 className="text-[16px] font-bold uppercase text-[#CC3300] mb-10">Who this stage is for</h2>
                <div className="space-y-6">
                  {highlights.map((item: string, i: number) => (
                    <p key={i} className="text-[20px] md:text-[24px] font-bold text-[#0F0000] leading-tight flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CC3300] mt-3 shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
                <p className="mt-10 text-[#0F0000]/80 text-lg leading-relaxed italic">
                  {plan.slug === 'foundation' 
                    ? "If you're about to show up publicly, this is where you build it properly."
                    : plan.slug === 'clarity'
                    ? "Founders who feel their brand no longer reflects their business."
                    : "Companies launching new product lines or expanding nationally or internationally."}
                </p>
              </section>

              <hr className="border-[#0F0000]/10 mb-20" />

              {/* What's Included */}
              <section className="mb-24">
                <h2 className="text-[16px] font-bold uppercase text-[#CC3300] mb-12">What&apos;s included</h2>
                
                <div className="space-y-20">
                  {sectionsList.map((section: any, idx: number) => (
                    <div key={idx}>
                      <h3 className="text-2xl font-black text-[#0F0000] mb-4">{section.title}</h3>
                      {section.description && (
                        <p className="text-[#0F0000]/60 mb-8 italic">{section.description}</p>
                      )}
                      <ul className="space-y-4">
                        {(section.items || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-lg text-[#0F0000]/80 font-medium">
                            <MdCheck className="text-[#CC3300] mt-1 shrink-0" size={20} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-[#0F0000]/10 mb-20" />

              {/* Timeline & Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                <div>
                  <h2 className="text-[16px] font-bold uppercase text-[#CC3300] mb-6">Timeline</h2>
                  <p className="text-3xl font-black text-[#0F0000] mb-4">{timelineText}</p>
                  <p className="text-[#0F0000]/60 text-sm leading-relaxed font-medium">
                    Clear milestones are shared inside the client portal once the project begins.
                  </p>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold uppercase text-[#CC3300] mb-6">Investment</h2>
                  <p className="text-3xl font-black text-[#0F0000] mb-4">{price}</p>
                  <p className="text-[#0F0000]/60 text-sm leading-relaxed font-medium">
                    {investmentDetails}
                  </p>
                </div>
              </div>

              <hr className="border-[#0F0000]/10 mb-20" />

              {/* What you walk away with */}
              <section className="mb-24 bg-[#0F0000] text-[#FDF3E6] rounded-2xl p-10 md:p-16">
                <h2 className="text-[16px] font-bold uppercase bg-[#CC3300] p-2 rounded-full w-fit text-[#FDF3E6] mb-10">What you walk away with</h2>
                <div className="space-y-8">
                  {walkAwayList.map((item: string, i: number) => (
                    <p key={i} className="text-2xl md:text-2xl font-extrabold leading-tight">
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              {/* Final CTA */}
              <section className="mb-20 py-20 border-t border-[#0F0000]/10">
                <h2 className="text-[16px] font-bold uppercase text-[#CC3300] mb-10">Apply for {stage}</h2>
                <p className="text-xl md:text-2xl text-[#0F0000] font-bold leading-relaxed mb-12">
                  {discoveryIntro}
                </p>
                <button
                  onClick={() => setViewState("FORM")}
                  className="inline-flex items-center justify-between w-full bg-[#0f0000] text-white px-10 py-6 rounded-full text-lg font-bold hover:bg-[#CC3300] transition-colors group"
                >
                  Apply for {stage}
                  <MdArrowOutward className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <p className="mt-8 text-center text-[#0F0000]/80 text-lg font-medium">
                  After alignment, you will receive a tailored proposal before payment is made.
                </p>
              </section>

              {/* Other Stages Navigation */}
              <section className="mt-12 pt-20 border-t border-[#0F0000]/10">
                <h2 className="text-[16px] font-extrabold uppercase text-[#0F0000]/30 mb-8 text-center">Compare Stages</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {plans.map((otherPlan: any) => (
                    <Link
                      key={otherPlan.slug}
                      href={`/pricing/${otherPlan.slug}`}
                      className={`px-4 py-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 group ${
                        otherPlan.slug === plan.slug
                        ? "bg-[#5C1500] border-[#CC3300] text-white pointer-events-none"
                        : "bg-white border-[#0F0000]/10 text-[#0F0000] hover:border-[#CC3300] hover:text-[#CC3300]"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{otherPlan.stage || `Stage 0${otherPlan.id}`}</span>
                      <span className="text-[13px] font-bold whitespace-nowrap">{otherPlan.subtitle}</span>
                    </Link>
                  ))}
                </div>
              </section>

            </motion.div>
          )}

          {viewState === "FORM" && (
            <motion.div 
              key="stage-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {submittingBrief ? (
                <div className="bg-white rounded-[3rem] p-16 border-6 border-[#0F0000] shadow-2xl flex flex-col items-center justify-center py-32 text-center my-10">
                  <div className="w-16 h-16 border-6 border-orange border-t-transparent rounded-full animate-spin mb-8" />
                  <h3 className="text-2xl font-black text-[#0F0000] tracking-tight">Submitting Brief...</h3>
                  <p className="text-sm font-medium text-[#0F0000]/50 mt-2">Uploading lead details securely to your Andrewbrandr Dashboard Inbox</p>
                </div>
              ) : (
                <>
                  <QualificationForm 
                    slug={plan.slug} 
                    stage={plan.stage} 
                    onSubmit={handleFormSubmit} 
                  />
                  <button
                    onClick={() => setViewState("DETAILS")}
                    className="w-full text-center text-[#0F0000]/40 hover:text-[#CC3300] font-bold uppercase tracking-widest text-xs transition-colors mt-8"
                  >
                    Back to details
                  </button>
                </>
              )}
            </motion.div>
          )}

          {viewState === "CONFIRMATION" && (
            <motion.div 
              key="confirmation-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              variants={fadeInUp}
              className="py-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 border-6 border-[#0F0000] shadow-2xl">
                <div className="w-16 h-16 bg-[#33CC33] rounded-full flex items-center justify-center text-white mb-10">
                  <MdCheck size={40} />
                </div>
                
                <h1 className="text-[32px] md:text-[48px] font-black text-[#0F0000] leading-[1.1] mb-8 tracking-tight">
                  What happens next
                </h1>
                <p className="text-xl font-bold text-[#0F0000] mb-12">
                  We&apos;ll review your application within 24 hours.
                </p>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <p className="text-[#0F0000]/80 leading-relaxed font-medium">
                      If this stage is aligned with your goals, you&apos;ll receive an email with a discovery call link.
                    </p>
                    <div className="bg-[#FDF3E6] rounded-2xl p-8 space-y-4">
                      <p className="text-[16px] font-bold uppercase tracking-widest text-[#CC3300]">During the call, we&apos;ll talk about:</p>
                      <ul className="space-y-3 text-lg font-bold text-[#0F0000]">
                        <li>• Your brand&apos;s current state and goals</li>
                        <li>• What needs to happen in this stage</li>
                        <li>• Timeline and investment</li>
                        <li>• Any questions you have</li>
                      </ul>
                    </div>
                    <p className="text-[#0F0000]/60 font-medium">After alignment, you&apos;ll receive a tailored proposal before any payment is made.</p>
                  </div>

                  <hr className="border-[#0F0000]/10" />

                  <div className="space-y-6">
                    <h2 className="text-xl font-black text-[#0F0000]">Common question: What about ongoing support?</h2>
                    <p className="text-[#0F0000]/80 leading-relaxed font-medium">
                      Some clients ask about maintaining their brand after launch. We offer optional retainers for:
                    </p>
                    <ul className="space-y-3 text-[#0F0000] font-bold">
                      <li>• Consistent social media presence</li>
                      <li>• Brand updates and new applications</li>
                      <li>• Ongoing design support</li>
                    </ul>
                    <p className="text-[#0F0000]/80 leading-relaxed font-medium">
                      This can be discussed during or after your project, depending on what makes sense for your business.
                    </p>
                  </div>

                  <div className="pt-6">
                    <div className="inline-flex items-center justify-center w-full bg-[#0F0000] text-white px-10 py-6 rounded-full text-lg font-bold">
                      We&apos;ll be in touch shortly.
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/#pricing"
                className="mt-12 block w-full text-center text-[#0F0000]/40 hover:text-[#CC3300] font-bold uppercase tracking-widest text-xs transition-colors"
              >
                Return to homepage
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
