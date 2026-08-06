"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePendingBriefs } from "@/lib/hooks/useDashboardData";
import { useState } from "react";
import { FiCheck, FiX, FiClock, FiFileText, FiMessageSquare, FiExternalLink, FiCheckCircle, FiDollarSign, FiArrowRight, FiVideo, FiAlertTriangle, FiMail } from "react-icons/fi";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { createClient, createEngagement, updateEngagement } from "@/lib/firebase/engagements";
import { TIER_CONFIG } from "@/lib/constants/tierConfig";
import { getNextDiscoverySlot } from "@/lib/discovery-schedule";
import { sendTargetVerificationEmail } from "@/lib/firebase/verifications";

export default function BriefsPage() {
    const { briefs, loading } = usePendingBriefs();
    const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmBrief, setConfirmBrief] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
    const [acceptedEngagement, setAcceptedEngagement] = useState<{
        id: string;
        clientName: string;
        plan: string;
        discoveryCall?: {
            date: string;
            time: string;
            meetLink: string;
            eventLink?: string;
        } | null;
    } | null>(null);

    const formatBriefDocumentation = (brief: any) => {
        return [
            `Client: ${brief.clientName || "N/A"}`,
            `Business: ${brief.businessName || "N/A"}`,
            `Package: ${brief.package || "N/A"}`,
            "",
            `Primary Goal: ${brief.primaryGoal || "N/A"}`,
            `Target Audience: ${brief.targetAudience || "N/A"}`,
            `Brand Personality: ${(brief.brandPersonality || []).join(", ") || "N/A"}`,
            `Colour Preferences: ${brief.colorPreferences || "N/A"}`,
            `Deliverables: ${(brief.deliverables || []).join(", ") || "N/A"}`,
            `Deadline: ${brief.deadline || "N/A"}`,
            "",
            `Additional Notes: ${brief.additionalNotes || "N/A"}`,
        ].join("\n");
    };

    const collectRawNotes = (brief: any) => {
        const sources = [
            brief.brief?.proposedGoal,
            brief.brief?.description,
            brief.brief?.notes,
            brief.brief?.newMarkets,
            brief.brief?.currentCustomers,
            brief.brief?.idealCustomers,
        ];
        return sources.filter(Boolean).join("\n\n");
    };

    const handleAcceptBrief = async (brief: any) => {
        if (!brief) return;
        setIsConverting(true);
        setError(null);
        try {
            const clientName = brief.lead?.fullName || brief.brief?.businessName || "New Client";
            const tier = brief.plan === "enterprise" ? "Enterprise" :
                brief.plan === "scale" ? "Scale" :
                    brief.plan === "clarity" ? "Clarity" : "Foundation";

            // 1. Create a client profile
            const clientId = await createClient({
                name: clientName,
                email: brief.lead?.email || "",
                industry: brief.brief?.industry || ""
            });

            const initialPrice = TIER_CONFIG[tier]?.defaultPriceNGN || 0;

            // 2. Initialize the engagement workspace correctly (stages, milestones, portal token, etc.)
            const newEngagementId = await createEngagement({
                clientIds: [clientId],
                projectName: brief.brief?.businessName || `${clientName} Brand Project`,
                tier,
                paymentStructure: brief.retainer ? "once" : "twice",
                customPrice: initialPrice
            });

            // 3. Attach brief-specific details
            await updateEngagement(newEngagementId, {
                briefRef: brief.id,
                retainer: brief.retainer || false,
                paymentStatus: brief.paymentStatus || "pending",
                paymentRef: brief.paymentRef || "",
                contact: brief.lead || {}
            } as any);

            // 4. Run Gemini + schedule the first discovery call (Google Meet).
            // The Meet invite only goes out once the client's email is verified;
            // otherwise we still generate the Gemini brief but defer scheduling.
            const emailVerified = brief.lead?.emailVerified === true;
            let discoveryCall: { date: string; time: string; meetLink: string; eventLink?: string } | null = null;
            try {
                const slot = await getNextDiscoverySlot();
                const rawNotes = collectRawNotes(brief);

                const res = await fetch("/api/discovery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clientName,
                        clientEmail: emailVerified ? brief.lead?.email || "" : "",
                        packageName: `${tier} Branding`,
                        rawNotes,
                        dateTime: slot?.dateTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                        durationMinutes: slot?.durationMinutes,
                    }),
                });
                const data = await res.json();

                const engagementUpdates: Record<string, any> = {};
                if (data.brief) {
                    engagementUpdates["stages.discovery.documentation"] = formatBriefDocumentation(data.brief);
                }
                if (data.meeting && slot) {
                    discoveryCall = {
                        date: slot.date,
                        time: slot.time,
                        meetLink: data.meeting.meetLink || "",
                        eventLink: data.meeting.eventLink || "",
                    };
                    engagementUpdates["discoveryCall"] = {
                        ...discoveryCall,
                        scheduledAt: Timestamp.now(),
                    };
                    engagementUpdates["milestones.discovery.Discovery call scheduled"] = true;
                }
                if (data.meeting?.eventId) {
                    engagementUpdates["calendarEventIds"] = arrayUnion(data.meeting.eventId);
                }
                if (Object.keys(engagementUpdates).length > 0) {
                    await updateDoc(doc(db, "engagements", newEngagementId), {
                        ...engagementUpdates,
                        updatedAt: Timestamp.now(),
                    });
                }
            } catch (integrationError) {
                console.error("Failed to run discovery integration:", integrationError);
            }

            // 5. Mark brief as accepted
            await updateDoc(doc(db, "briefs", brief.id), {
                status: "accepted",
                acceptedAt: new Date(),
                engagementId: newEngagementId
            });

            // 6. Show success state with next-action CTAs
            setIsConfirmOpen(false);
            setConfirmBrief(null);
            setSelectedBrief(null);
            setAcceptedEngagement({
                id: newEngagementId,
                clientName,
                plan: brief.plan,
                discoveryCall
            });
        } catch (acceptError) {
            console.error("Error accepting brief:", acceptError);
            setError("Failed to accept brief. Please try again.");
            setIsConfirmOpen(false);
        } finally {
            setIsConverting(false);
        }
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr + "T00:00:00");
        return dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const handleResendVerification = async (brief: any) => {
        const email = brief.lead?.email;
        if (!email) return;
        setVerifyNotice(null);
        try {
            await sendTargetVerificationEmail({
                targetType: "brief",
                targetId: brief.id,
                email,
                clientName: brief.lead?.fullName,
            });
            setVerifyNotice(`Verification link sent to ${email}.`);
        } catch (e) {
            console.error("[Resend Verification]", e);
            setError("Failed to send the verification link. Please try again.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
            <div className={`flex-1 transition-all ${selectedBrief ? 'md:w-1/2 lg:w-1/3 block' : 'w-full block'}`}>
                <div className="mb-8">
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Briefs Inbox
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Review incoming client onboarding submissions and convert them to active engagements.
                    </p>
                </div>

                {/* In-system error toast (no browser alert) */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-between text-xs mb-4"
                        >
                            <span className="flex items-center gap-2 text-red-400 font-bold">
                                <FiAlertTriangle size={16} />
                                {error}
                            </span>
                            <button onClick={() => setError(null)} className="text-red-400/70 hover:text-red-400">
                                <FiX size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* In-system success toast (no browser alert) */}
                <AnimatePresence>
                    {verifyNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl border border-green/20 bg-green/5 flex items-center justify-between text-xs mb-4"
                        >
                            <span className="flex items-center gap-2 text-green font-bold">
                                <FiCheckCircle size={16} />
                                {verifyNotice}
                            </span>
                            <button onClick={() => setVerifyNotice(null)} className="text-green/70 hover:text-green">
                                <FiX size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] animate-pulse" />
                        ))}
                    </div>
                ) : briefs.length > 0 ? (
                    <div className="space-y-4">
                        {acceptedEngagement && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl border border-green/20 bg-green/5 flex items-center justify-between text-xs mb-4"
                            >
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green" size={16} />
                                    <span>
                                        Engagement created for <strong>{acceptedEngagement.clientName}</strong>!
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href={`/dashboard/engagements/${acceptedEngagement.id}`} className="text-orange font-bold hover:underline flex items-center gap-1">
                                        Workspace <FiExternalLink size={10} />
                                    </Link>
                                    <span className="text-white/20">|</span>
                                    <Link href="/dashboard/finances" className="text-orange font-bold hover:underline flex items-center gap-1">
                                        Invoice <FiDollarSign size={10} />
                                    </Link>
                                    <span className="text-white/20">|</span>
                                    <button onClick={() => setAcceptedEngagement(null)} className="text-[var(--text-muted)] hover:text-white">
                                        Dismiss
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        {briefs.map((brief) => (
                            <motion.div
                                key={brief.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedBrief(brief)}
                                className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedBrief?.id === brief.id
                                        ? "border-orange bg-orange/5"
                                        : "border-[var(--border-color)] bg-[var(--surface)] hover:border-orange/30"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-orange/10 text-orange">
                                            <FiFileText size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)] text-sm">
                                                {brief.brief?.businessName || "Unnamed Business"}
                                            </h3>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {brief.lead?.fullName || "No Name Provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-orange px-2 py-1 bg-orange/10 rounded-full">
                                        New
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                                    <span className="flex items-center gap-1">
                                        <FiClock size={12} />
                                        {brief.createdAt?.toLocaleDateString() || "Unknown Data"}
                                    </span>
                                    <span className="text-sm font-bold">
                                        {brief.plan} Plan
                                    </span>
                                </div>
                                {brief.lead?.emailVerified !== true && (
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                                            <FiAlertTriangle size={10} />
                                            Email unverified
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResendVerification(brief);
                                            }}
                                            className="text-[10px] font-bold text-orange hover:underline flex items-center gap-1"
                                        >
                                            <FiMail size={10} />
                                            Send verification link
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : acceptedEngagement ? (
                    /* ── POST-ACCEPT SUCCESS STATE ── */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-3xl border border-green/20 bg-green/5 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-green/10 text-green flex items-center justify-center mx-auto mb-5">
                            <FiCheckCircle size={28} />
                        </div>
                        <h3 className="text-xl font-display text-[var(--text-primary)] mb-2">
                            Engagement Created
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-1">
                            <span className="font-bold text-[var(--text-primary)]">{acceptedEngagement.clientName}</span> has been onboarded.
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mb-6 capitalize">
                            Plan: {acceptedEngagement.plan} · Status: Active
                        </p>

                        {/* Discovery call confirmation */}
                        {acceptedEngagement.discoveryCall?.meetLink ? (
                            <div className="max-w-md mx-auto mb-8 p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-left space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange flex items-center gap-2">
                                    <FiVideo size={12} />
                                    First Discovery Call Scheduled
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-muted)] text-xs font-bold">Date</span>
                                    <span className="font-bold text-[var(--text-primary)]">
                                        {formatDate(acceptedEngagement.discoveryCall.date)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-muted)] text-xs font-bold">Time</span>
                                    <span className="font-bold text-[var(--text-primary)]">
                                        {formatTime(acceptedEngagement.discoveryCall.time)}
                                    </span>
                                </div>
                                <a
                                    href={acceptedEngagement.discoveryCall.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green text-white text-xs font-black hover:bg-white hover:text-black transition-all"
                                >
                                    <FiVideo size={14} />
                                    Join Google Meet
                                </a>
                            </div>
                        ) : (
                            <p className="text-xs text-[var(--text-muted)] mb-6">
                                The discovery call will be scheduled from the engagement
                                workspace once the client's email is verified.
                            </p>
                        )}

                        {/* Next step CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={`/dashboard/engagements/${acceptedEngagement.id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20"
                            >
                                Open Engagement Workspace
                                <FiExternalLink size={14} />
                            </Link>
                            <Link
                                href="/dashboard/finances"
                                className="flex items-center gap-2 px-6 py-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-bold rounded-xl hover:border-orange/40 hover:text-orange transition-all"
                            >
                                <FiDollarSign size={14} />
                                Create Invoice
                            </Link>
                        </div>

                        <button
                            onClick={() => setAcceptedEngagement(null)}
                            className="mt-8 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Back to Inbox
                        </button>
                    </motion.div>
                ) : (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface)]">
                        <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
                            <FiCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Inbox Zero</h3>
                        <p className="text-sm text-[var(--text-secondary)]">You have reviewed all incoming briefs.</p>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {selectedBrief && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-[1.5] bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 lg:p-8 sticky top-8 h-fit"
                >
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-color)]">
                        <h2 className="text-2xl font-display text-[var(--text-primary)]">Brief Details</h2>
                        <button
                            onClick={() => setSelectedBrief(null)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--surface-elevated)]"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                        {/* Client Info */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Client Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Name</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm">{selectedBrief.lead?.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm">{selectedBrief.lead?.email}</p>
                                    {selectedBrief.lead?.emailVerified === true ? (
                                        <p className="text-[10px] font-bold text-green mt-0.5 flex items-center gap-1">
                                            <FiCheckCircle size={10} />
                                            Verified
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => handleResendVerification(selectedBrief)}
                                            className="text-[10px] font-bold text-orange hover:underline mt-0.5"
                                        >
                                            Send verification link
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Currency</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm uppercase">{selectedBrief.lead?.currency}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Channel Contact</p>
                                    <p className="font-medium text-[var(--text-primary)] text-sm flex items-center gap-2">
                                        <FiMessageSquare size={12} className="text-orange" />
                                        {selectedBrief.lead?.whatsapp || selectedBrief.lead?.telegram || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Order Info */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Order Summary</h3>
                            <div className="bg-[var(--surface-elevated)] rounded-xl p-4 border border-[var(--border-color)]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Plan Selected</span>
                                    <span className="text-sm font-bold text-[var(--text-primary)] capitalize">{selectedBrief.plan}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Retainer Opt-in</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedBrief.retainer ? 'bg-green/10 text-green-500' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                                        {selectedBrief.retainer ? "YES" : "NO"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-[var(--border-color)]">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Payment Status</span>
                                    <span className="text-sm font-bold capitalize text-orange">{selectedBrief.paymentStatus || "pending"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Brief Answers (Dynamic based on fields present) */}
                        <section>
                            <h3 className="text-sm font-bold text-[var(--text-muted)] mb-4">Project Brief</h3>
                            <div className="space-y-4">
                                {Object.keys(selectedBrief.brief || {}).map((key) => {
                                    const value = selectedBrief.brief[key];
                                    if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                    // Format camelCase keys to readable labels
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                    return (
                                        <div key={key}>
                                            <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex gap-4">
                        <button
                            onClick={() => {
                                setConfirmBrief(selectedBrief);
                                setIsConfirmOpen(true);
                            }}
                            disabled={isConverting}
                            className="flex-1 bg-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-light transition-all disabled:opacity-50 text-sm"
                        >
                            {isConverting ? "Creating Project..." : "Accept & Create Project"}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* In-system confirm modal (no browser confirm) */}
            <AnimatePresence>
                {isConfirmOpen && confirmBrief && (
                    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsConfirmOpen(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 sm:p-8 z-10"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange/10 text-orange flex items-center justify-center mb-4">
                                <FiFileText size={20} />
                            </div>
                            <h3 className="text-lg font-black text-[var(--text-primary)] mb-2">Accept & Create Project</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
                                You are about to onboard <strong className="text-[var(--text-primary)]">{confirmBrief.lead?.fullName || confirmBrief.brief?.businessName}</strong> as a{" "}
                                <strong className="capitalize text-orange">{confirmBrief.plan}</strong> client. This will:
                            </p>
                            <ul className="space-y-2 mb-6">
                                {[
                                    "Create the client profile and engagement workspace",
                                    "Run Gemini to structure the creative brief",
                                    confirmBrief.lead?.emailVerified === true
                                        ? "Generate a Google Meet link and fix the first discovery call date & time"
                                        : "Schedule the first discovery call once the client's email is verified"
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] font-medium">
                                        <FiCheckCircle size={13} className="text-green mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsConfirmOpen(false)}
                                    disabled={isConverting}
                                    className="flex-1 py-3 px-4 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAcceptBrief(confirmBrief)}
                                    disabled={isConverting}
                                    className="flex-1 py-3 px-4 rounded-xl bg-orange text-white text-xs font-black hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isConverting ? "Creating..." : (
                                        <>
                                            Confirm & Create
                                            <FiArrowRight size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
