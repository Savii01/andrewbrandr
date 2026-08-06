"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAvailabilitySettings, AvailabilitySettings, DEFAULT_AVAILABILITY_SETTINGS } from "@/lib/firebase/availability";
import { getBookedSlotsForDate, createBooking } from "@/lib/firebase/bookings";
import { FiChevronLeft, FiChevronRight, FiClock, FiGlobe, FiCheckCircle, FiDownload, FiUser, FiMail, FiMessageSquare, FiVideo, FiCalendar, FiAlertCircle } from "react-icons/fi";
import emailjs from "@emailjs/browser";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CalendarWidget() {
    const [settings, setSettings] = useState<AvailabilitySettings>(DEFAULT_AVAILABILITY_SETTINGS);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    
    // Toggles and layout states
    const [use12h, setUse12h] = useState(true);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [meetLink, setMeetLink] = useState<string | null>(null);
    const [eventLink, setEventLink] = useState<string | null>(null);
    const [meetScheduled, setMeetScheduled] = useState<boolean | null>(null);
    const [clientTimezone, setClientTimezone] = useState("UTC");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        notes: ""
    });

    // Detect client timezone on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setClientTimezone(tz || "UTC");
        }
    }, []);

    // Load general availability settings
    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const data = await getAvailabilitySettings();
            setSettings(data);
            setLoading(false);
        }
        fetchSettings();
    }, []);

    // Load booked/busy slots whenever selected date changes
    useEffect(() => {
        if (!selectedDate) {
            setBookedSlots([]);
            setAvailableSlots([]);
            return;
        }

        async function fetchBookedSlots() {
            const booked = await getBookedSlotsForDate(selectedDate!);
            setBookedSlots(booked);
            generateAvailableSlots(selectedDate!, booked);
        }
        fetchBookedSlots();
    }, [selectedDate, settings]);

    // Generate slots of specific duration inside the start/end working hours range
    const generateAvailableSlots = (dateStr: string, bookedList: string[]) => {
        const slots: string[] = [];
        const { start, end } = settings.workingHours;
        const duration = settings.duration;

        // Parse start and end hours
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);

        let current = new Date();
        current.setHours(startH, startM, 0, 0);

        const limit = new Date();
        limit.setHours(endH, endM, 0, 0);

        const todayStr = new Date().toISOString().split("T")[0];
        const now = new Date();

        while (current < limit) {
            const h = String(current.getHours()).padStart(2, "0");
            const m = String(current.getMinutes()).padStart(2, "0");
            const slotStr = `${h}:${m}`;

            // Check if slot has already passed today
            let isValid = true;
            if (dateStr === todayStr) {
                const slotTime = new Date();
                slotTime.setHours(current.getHours(), current.getMinutes(), 0, 0);
                if (slotTime <= now) {
                    isValid = false;
                }
            }

            // Exclude booked slots
            if (isValid && !bookedList.includes(slotStr)) {
                slots.push(slotStr);
            }

            current.setMinutes(current.getMinutes() + duration);
        }

        setAvailableSlots(slots);
    };

    // Mini Calendar variables
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Adjust week start to Monday (0=Mon, 6=Sun)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth()) return; // Lock past months
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Slot 12h formatter helper
    const formatTimeSlot = (timeStr: string) => {
        if (!use12h) return timeStr;
        const [hours, minutes] = timeStr.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    const handleSelectDay = (dayNum: number) => {
        const selected = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
        setSelectedDate(selected);
        setSelectedTime(null);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;

        setSubmitting(true);
        setBookingError(null);
        try {
            // Save booking to Firebase (atomically checks slot lock)
            const newBookingId = await createBooking({
                name: formData.name,
                email: formData.email,
                date: selectedDate,
                time: selectedTime,
                timezone: clientTimezone,
                notes: formData.notes
            });

            if (newBookingId) {
                // EmailJS Trigger
                const emailParams = {
                    client_name: formData.name,
                    client_email: formData.email,
                    booking_date: selectedDate,
                    booking_time: formatTimeSlot(selectedTime),
                    timezone: clientTimezone,
                    notes: formData.notes || "No message provided."
                };

                emailjs.send(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                    process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID!,
                    emailParams,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
                ).catch((err) => console.error("EmailJS Error (silent fallback):", err));

                setBookingSuccess(true);
                setShowBookingForm(false);
                scheduleGoogleMeet();
            }
        } catch (error: any) {
            setBookingError(error.message || "Failed to finalize booking. Slot might have been booked.");
        }
        setSubmitting(false);
    };

    // Creates a real Google Calendar event with a Google Meet link for the booked slot
    const scheduleGoogleMeet = async () => {
        if (!selectedDate || !selectedTime) return;
        try {
            const localDate = new Date(`${selectedDate}T${selectedTime}:00`);
            const dateTime = localDate.toISOString();

            const res = await fetch("/api/calendar/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: formData.name,
                    clientEmail: formData.email,
                    dateTime,
                    packageName: "Brandr Discovery & Strategy Session",
                    notes: formData.notes || "Discovery & strategy kickoff with Saviour Andrew (Brandr Studio).",
                    durationMinutes: settings.duration
                })
            });

            const data = await res.json();
            if (data.success) {
                setMeetLink(data.meetLink || null);
                setEventLink(data.eventLink || null);
                setMeetScheduled(true);
            } else {
                setMeetScheduled(false);
                console.error("[Meet Scheduling]", data.error);
            }
        } catch (error) {
            setMeetScheduled(false);
            console.error("[Meet Scheduling]", error);
        }
    };

    // Client ICS calendar invite downloader
    const downloadICS = () => {
        if (!selectedDate || !selectedTime) return;
        const dateClean = selectedDate.replace(/-/g, ""); // YYYYMMDD
        const [h, m] = selectedTime.split(":");
        const startTimeStr = `${dateClean}T${h}${m}00`;

        const dateObj = new Date(`${selectedDate}T${selectedTime}:00`);
        dateObj.setMinutes(dateObj.getMinutes() + settings.duration);
        const endH = String(dateObj.getHours()).padStart(2, "0");
        const endM = String(dateObj.getMinutes()).padStart(2, "0");
        const endTimeStr = `${dateClean}T${endH}${endM}00`;

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Brandr//Discovery Session//EN",
            "BEGIN:VEVENT",
            `UID:brandr-discovery-${dateClean}-${h}${m}@brandr.studio`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART:${startTimeStr}`,
            `DTEND:${endTimeStr}`,
            "SUMMARY:Brandr Discovery & Strategy Session",
            "DESCRIPTION:Strategy kickoff with Saviour Andrew (Brandr Studio).",
            `LOCATION:${meetLink || "Google Meet (Link will be sent)"}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `brandr-discovery-${selectedDate}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-[2rem] min-h-[450px]">
                <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full bg-[#110101] border border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8 text-[#fdf3e6]">
            
            {/* SUCCESS VIEW */}
            {bookingSuccess ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10"
                >
                    <div className="w-16 h-16 bg-orange/15 rounded-full flex items-center justify-center mb-6">
                        <FiCheckCircle size={32} className="text-orange" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">Discovery Session Confirmed!</h3>
                    <p className="text-white/70 text-sm max-w-sm mb-6 leading-relaxed">
                        Your session has been successfully booked with Saviour. A Google Calendar invite with your Google Meet link has been sent to your email.
                    </p>
                    
                    {/* Booking Details Card */}
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3 font-medium">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-white/40">Date:</span>
                            <span className="font-bold text-orange">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-white/40">Time:</span>
                            <span className="font-mono font-bold">{formatTimeSlot(selectedTime!)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white/50">
                            <span>Timezone:</span>
                            <span>{clientTimezone}</span>
                        </div>
                    </div>

                    {/* Google Meet Link */}
                    {meetScheduled === false ? (
                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left">
                            <p className="text-xs text-white/60 leading-relaxed">
                                We could not generate your Google Meet link automatically. We will send it to your email shortly before the call.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 w-full mb-8">
                            <a
                                href={meetLink || "#"}
                                onClick={(e) => !meetLink && e.preventDefault()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all w-full ${
                                    meetLink
                                        ? "bg-green hover:bg-white hover:text-black text-white shadow-lg shadow-green/10"
                                        : "bg-white/5 border border-white/10 text-white/40 pointer-events-none"
                                }`}
                            >
                                <FiVideo size={16} />
                                {meetLink ? "Join Google Meet" : "Creating your Google Meet link..."}
                            </a>
                            {eventLink && (
                                <a
                                    href={eventLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-orange/40 hover:bg-orange/5 font-bold text-sm text-white/70 hover:text-white transition-all w-full"
                                >
                                    <FiCalendar size={16} />
                                    Open Event in Google Calendar
                                </a>
                            )}
                        </div>
                    )}

                    <button
                        onClick={downloadICS}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange hover:bg-white hover:text-black font-bold text-sm text-white transition-all w-full sm:w-auto"
                    >
                        <FiDownload size={16} />
                        Add to Calendar (.ics)
                    </button>
                </motion.div>
            ) : (
                <div>
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-3">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">Select Date & Time</h3>
                            <span className="flex items-center gap-1.5 text-xs text-white/50 mt-1 font-medium">
                                <FiGlobe size={13} />
                                Local zone: {clientTimezone}
                            </span>
                        </div>
                        
                        {/* 12h/24h toggle */}
                        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider self-start sm:self-auto">
                            <button
                                onClick={() => setUse12h(true)}
                                className={`px-2.5 py-1 rounded transition-colors ${use12h ? "bg-orange text-white" : "text-white/60 hover:text-white"}`}
                            >
                                12H
                            </button>
                            <button
                                onClick={() => setUse12h(false)}
                                className={`px-2.5 py-1 rounded transition-colors ${!use12h ? "bg-orange text-white" : "text-white/60 hover:text-white"}`}
                            >
                                24H
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Left: Mini Calendar Grid */}
                        <div className="md:col-span-7">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold tracking-wide">
                                    {monthNames[month]} {year}
                                </h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                        disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">
                                <span>Mo</span>
                                <span>Tu</span>
                                <span>We</span>
                                <span>Th</span>
                                <span>Fr</span>
                                <span>Sa</span>
                                <span>Su</span>
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                                    
                                    // Check past dates
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const targetDate = new Date(year, month, dayNum);
                                    const isPast = targetDate < today;

                                    // Check active working day
                                    const dayOfWeek = targetDate.getDay();
                                    const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                    const isAvailableDay = settings.workingDays.includes(DAYS_OF_WEEK[adjustedDayIndex]);
                                    
                                    // Check block dates
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
                                                    ? "bg-white/5 border border-white/5 hover:border-orange/50 hover:bg-orange/5 text-white"
                                                    : "text-white/20 border border-transparent cursor-not-allowed"
                                            }`}
                                        >
                                            {dayNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Available Slots Pool */}
                        <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                            <h4 className="text-sm font-bold tracking-wide mb-4">
                                {selectedDate ? `Available Slots for ${selectedDate}` : "Select a date to view slots"}
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
                                                            : "bg-white/5 border-white/5 hover:border-orange hover:bg-orange/5 text-white/80 hover:text-white"
                                                    }`}
                                                >
                                                    {formatTimeSlot(timeStr)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/40 text-xs">
                                        No available time slots for this date.
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8 text-white/40 text-xs">
                                    Please select a highlighted date on the calendar grid.
                                </div>
                            )}

                            {/* Booking CTA */}
                            {selectedDate && selectedTime && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 pt-4 border-t border-white/5"
                                >
                                    <button
                                        onClick={() => setShowBookingForm(true)}
                                        className="w-full py-3.5 px-4 bg-orange text-white text-xs font-black rounded-full hover:bg-white hover:text-black transition-all shadow-xl shadow-orange/10"
                                    >
                                        Book at {formatTimeSlot(selectedTime)}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL FORM OVERLAY FOR DATA INPUT */}
            <AnimatePresence>
                {showBookingForm && (
                    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBookingForm(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Form Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-[#110101] border border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8 text-[#fdf3e6] z-10"
                        >
                            <h3 className="text-lg font-bold tracking-tight mb-1">Confirm Discovery Session</h3>
                            <p className="text-xs text-white/50 mb-6 font-medium">
                                Date: <span className="text-orange font-bold">{selectedDate}</span> · Time: <span className="font-mono font-bold text-orange">{formatTimeSlot(selectedTime!)}</span>
                            </p>

                            {bookingError && (
                                <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-2 text-xs text-red-400 font-bold">
                                    <FiAlertCircle size={14} className="mt-0.5 shrink-0" />
                                    <span>{bookingError}</span>
                                </div>
                            )}

                            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                                {/* Name Input */}
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                                        Your Name *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                            <FiUser size={14} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Saviour Andrew"
                                            className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#fdf3e6] placeholder-white/20 outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                            <FiMail size={14} />
                                        </span>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                            placeholder="you@example.com"
                                            className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#fdf3e6] placeholder-white/20 outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Brief/Message notes */}
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                                        Tell us about your brand / project (Optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-4 text-white/40">
                                            <FiMessageSquare size={14} />
                                        </span>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                            placeholder="Goals, timelines, design directions or visual styles you prefer..."
                                            rows={4}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#fdf3e6] placeholder-white/20 outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="flex-1 py-3 px-4 rounded-full border border-white/10 text-xs font-bold text-white/70 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 px-4 rounded-full bg-orange text-white text-xs font-black hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Booking..." : "Schedule Call"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
