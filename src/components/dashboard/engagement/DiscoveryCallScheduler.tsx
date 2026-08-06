"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Engagement } from "@/lib/types/dashboard";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { addActivityLog } from "@/lib/firebase/engagements";
import { getAvailabilitySettings, AvailabilitySettings, DEFAULT_AVAILABILITY_SETTINGS } from "@/lib/firebase/availability";
import { getBookedSlotsForDate } from "@/lib/firebase/bookings";
import { getNextDiscoverySlot } from "@/lib/discovery-schedule";
import { sendTargetVerificationEmail } from "@/lib/firebase/verifications";
import {
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiVideo,
    FiCalendar,
    FiMail,
    FiShield,
    FiCheckCircle,
    FiAlertCircle,
    FiRefreshCw,
} from "react-icons/fi";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

interface DiscoveryCallSchedulerProps {
    engagement: Engagement;
}

export default function DiscoveryCallScheduler({ engagement }: DiscoveryCallSchedulerProps) {
    const contact = engagement.contact || {};
    const clientEmail = (contact.email || "").trim();
    const emailVerified = contact.emailVerified === true;
    const clientName = contact.fullName || engagement.projectName;

    const call = engagement.discoveryCall;

    const [settings, setSettings] = useState<AvailabilitySettings>(DEFAULT_AVAILABILITY_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [use12h, setUse12h] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [sendingVerify, setSendingVerify] = useState(false);
    const [verifySent, setVerifySent] = useState(false);

    // Load availability settings and pre-pick the next available slot
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await getAvailabilitySettings();
            if (cancelled) return;
            setSettings(data);
            const slot = await getNextDiscoverySlot();
            if (cancelled) return;
            if (slot) {
                setCurrentDate(new Date(`${slot.date}T00:00:00`));
                setSelectedDate(slot.date);
                setSelectedTime(slot.time);
            }
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Load booked slots + regenerate available slots whenever the date changes
    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }
        let cancelled = false;
        (async () => {
            const booked = await getBookedSlotsForDate(selectedDate);
            if (cancelled) return;
            generateAvailableSlots(selectedDate, booked);
        })();
        return () => {
            cancelled = true;
        };
    }, [selectedDate, settings]);

    const generateAvailableSlots = (dateStr: string, bookedList: string[]) => {
        const slots: string[] = [];
        const { start, end } = settings.workingHours;
        const duration = settings.duration;

        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);

        const current = new Date();
        current.setHours(startH, startM, 0, 0);
        const limit = new Date();
        limit.setHours(endH, endM, 0, 0);

        const todayStr = new Date().toISOString().split("T")[0];
        const now = new Date();

        while (current < limit) {
            const h = String(current.getHours()).padStart(2, "0");
            const m = String(current.getMinutes()).padStart(2, "0");
            const slotStr = `${h}:${m}`;

            let isValid = true;
            if (dateStr === todayStr) {
                const slotTime = new Date();
                slotTime.setHours(current.getHours(), current.getMinutes(), 0, 0);
                if (slotTime <= now) isValid = false;
            }
            if (isValid && !bookedList.includes(slotStr)) {
                slots.push(slotStr);
            }
            current.setMinutes(current.getMinutes() + duration);
        }

        setAvailableSlots(slots);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth()) return;
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleSelectDay = (dayNum: number) => {
        const selected = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
        setSelectedDate(selected);
        setSelectedTime(null);
    };

    const formatTimeSlot = (timeStr: string) => {
        if (!use12h) return timeStr;
        const [hours, minutes] = timeStr.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime || !emailVerified || !clientEmail) return;
        setSubmitting(true);
        setError(null);
        try {
            const localDate = new Date(`${selectedDate}T${selectedTime}:00`);
            const dateTime = localDate.toISOString();

            const res = await fetch("/api/calendar/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName,
                    clientEmail,
                    dateTime,
                    packageName: `${engagement.tier} Branding`,
                    notes: "Discovery & strategy kickoff with Saviour Andrew (Brandr Studio).",
                    durationMinutes: settings.duration,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Failed to schedule the call.");

            const updates: Record<string, any> = {
                discoveryCall: {
                    date: selectedDate,
                    time: selectedTime,
                    meetLink: data.meetLink || "",
                    eventLink: data.eventLink || "",
                    scheduledAt: Timestamp.now(),
                },
                "milestones.discovery.Discovery call scheduled": true,
            };
            if (data.eventId) {
                updates.calendarEventIds = arrayUnion(data.eventId);
            }
            await updateDoc(doc(db, "engagements", engagement.id), {
                ...updates,
                updatedAt: Timestamp.now(),
            });
            await addActivityLog(
                engagement.id,
                `Discovery call scheduled for ${selectedDate} at ${selectedTime}`,
                "system"
            );
            setIsRescheduling(false);
        } catch (e: any) {
            setError(e.message || "Failed to schedule the call.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendVerification = async () => {
        if (!clientEmail) return;
        setSendingVerify(true);
        setError(null);
        try {
            await sendTargetVerificationEmail({
                targetType: "engagement",
                targetId: engagement.id,
                email: clientEmail,
                clientName,
            });
            setVerifySent(true);
        } catch (e: any) {
            setError(e.message || "Failed to send the verification link.");
        } finally {
            setSendingVerify(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-6 p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── SCHEDULED STATE (existing call, not rescheduling) ──
    if (call?.meetLink && !isRescheduling) {
        return (
            <div className="mb-6 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-orange flex items-center gap-2">
                        <FiVideo size={14} />
                        First Discovery Call
                    </h3>
                    <button
                        onClick={() => setIsRescheduling(true)}
                        className="text-[10px] font-bold text-[var(--text-muted)] hover:text-orange flex items-center gap-1 transition-colors"
                    >
                        <FiRefreshCw size={10} />
                        Reschedule
                    </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)]">
                        <span className="text-[var(--text-muted)] font-bold">Date</span>
                        <span className="font-bold text-[var(--text-primary)]">{call.date}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)]">
                        <span className="text-[var(--text-muted)] font-bold">Time</span>
                        <span className="font-mono font-bold text-[var(--text-primary)]">
                            {formatTimeSlot(call.time)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href={call.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green text-white text-xs font-black hover:bg-black transition-all"
                    >
                        <FiVideo size={13} />
                        Join Google Meet
                    </a>
                    {call.eventLink && (
                        <a
                            href={call.eventLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-orange hover:border-orange/40 transition-all"
                        >
                            <FiCalendar size={13} />
                            Open in Google Calendar
                        </a>
                    )}
                </div>
            </div>
        );
    }

    // ── BLOCKED STATE (email missing or unverified) ──
    if (!clientEmail || !emailVerified) {
        return (
            <div className="mb-6 p-6 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border-color)] space-y-4">
                <h3 className="text-xs font-black text-orange flex items-center gap-2">
                    <FiVideo size={14} />
                    First Discovery Call
                </h3>

                {!clientEmail ? (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)]">
                        <FiAlertCircle size={16} className="text-orange mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">
                                No client email on file
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed mt-1">
                                Add the client's email to their profile so we can schedule the
                                call and send the Google Meet invite. Scheduling stays locked
                                until an email is captured and verified.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)]">
                            <FiShield size={16} className="text-orange mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-[var(--text-primary)]">
                                    Client email not verified yet
                                </p>
                                <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed mt-1">
                                    We don't send a Google Meet invite until we're sure the email
                                    belongs to the client. Send a verification link — the call
                                    scheduler unlocks as soon as they confirm.
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-bold text-red-400"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {verifySent ? (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-green/5 border border-green/20">
                                <FiCheckCircle size={16} className="text-green shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-green">
                                        Verification link sent
                                    </p>
                                    <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
                                        Sent to {clientEmail}. This unlocks once {clientName} clicks
                                        the link in their inbox.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSendVerification}
                                disabled={sendingVerify}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange text-white text-xs font-black hover:bg-black transition-all disabled:opacity-50"
                            >
                                <FiMail size={13} />
                                {sendingVerify ? "Sending verification link..." : "Send Verification Link"}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ── PICKER STATE (verified email) ──
    return (
        <div className="mb-6 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-black text-orange flex items-center gap-2">
                        <FiVideo size={14} />
                        Schedule the First Discovery Call
                    </h3>
                    <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-bold mt-1">
                        <FiCheckCircle size={12} className="text-green" />
                        Email verified · Invites go to {clientEmail}
                    </span>
                </div>

                <div className="flex bg-[var(--surface-elevated)] p-0.5 rounded-lg border border-[var(--border-color)] text-[10px] font-black uppercase tracking-wider self-start sm:self-auto">
                    <button
                        onClick={() => setUse12h(true)}
                        className={`px-2.5 py-1 rounded transition-colors ${use12h ? "bg-orange text-white" : "text-[var(--text-muted)] hover:text-white"}`}
                    >
                        12H
                    </button>
                    <button
                        onClick={() => setUse12h(false)}
                        className={`px-2.5 py-1 rounded transition-colors ${!use12h ? "bg-orange text-white" : "text-[var(--text-muted)] hover:text-white"}`}
                    >
                        24H
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-bold text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Calendar */}
                <div className="md:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                            {MONTH_NAMES[month]} {year}
                        </h4>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevMonth}
                                disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
                                className="p-1.5 border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors text-[var(--text-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-1.5 border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors text-[var(--text-muted)] hover:text-white"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">
                        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span>
                        <span>Fr</span><span>Sa</span><span>Su</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const targetDate = new Date(year, month, dayNum);
                            const isPast = targetDate < today;

                            const dayOfWeek = targetDate.getDay();
                            const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                            const isAvailableDay = settings.workingDays.includes(DAYS_OF_WEEK[adjustedDayIndex]);

                            const isBlocked = settings.blockedDates.includes(dateString);

                            const isClickable = !isPast && isAvailableDay && !isBlocked;
                            const isSelected = selectedDate === dateString;

                            return (
                                <button
                                    key={`day-${dayNum}`}
                                    onClick={() => isClickable && handleSelectDay(dayNum)}
                                    disabled={!isClickable}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        isSelected
                                            ? "bg-orange text-white font-black border border-orange shadow-lg shadow-orange/20 scale-105"
                                            : isClickable
                                            ? "bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] hover:border-orange/50 hover:bg-orange/5 text-[var(--text-primary)]"
                                            : "text-[var(--text-muted)]/30 border border-transparent cursor-not-allowed"
                                    }`}
                                >
                                    {dayNum}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Slots */}
                <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-6 md:pt-0 md:pl-8">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">
                        {selectedDate ? `Available slots for ${selectedDate}` : "Select a date to view slots"}
                    </h4>

                    {selectedDate ? (
                        availableSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                                {availableSlots.map((timeStr) => {
                                    const isSelected = selectedTime === timeStr;
                                    return (
                                        <button
                                            key={timeStr}
                                            onClick={() => setSelectedTime(timeStr)}
                                            className={`py-3 px-2 text-center text-xs rounded-xl font-bold font-mono transition-all border ${
                                                isSelected
                                                    ? "bg-orange border-orange text-white font-black"
                                                    : "bg-[var(--surface-elevated)]/40 border-[var(--border-color)] hover:border-orange hover:bg-orange/5 text-[var(--text-secondary)] hover:text-white"
                                            }`}
                                        >
                                            {formatTimeSlot(timeStr)}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)] text-xs">
                                No available time slots for this date.
                            </div>
                        )
                    ) : (
                        <div className="text-center py-8 text-[var(--text-muted)] text-xs">
                            Select a highlighted date on the calendar grid.
                        </div>
                    )}

                    {selectedDate && selectedTime && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 pt-4 border-t border-[var(--border-color)]"
                        >
                            <button
                                onClick={handleSchedule}
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-orange text-white text-xs font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10 disabled:opacity-50"
                            >
                                <FiClock size={13} />
                                {submitting
                                    ? "Scheduling call..."
                                    : `Schedule at ${formatTimeSlot(selectedTime)}`}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
