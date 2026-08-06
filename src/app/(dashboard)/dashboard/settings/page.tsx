"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
    getAvailabilitySettings,
    updateAvailabilitySettings,
    AvailabilitySettings,
    DEFAULT_AVAILABILITY_SETTINGS
} from "@/lib/firebase/availability";
import { FiClock, FiSettings, FiCalendar, FiChevronLeft, FiChevronRight, FiGrid, FiList } from "react-icons/fi";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DURATIONS = [15, 30, 45, 60];
const HOURS = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "scheduling">("general");
    
    // Project Intake settings state
    const [status, setStatus] = useState<"available" | "unavailable">("available");
    const [slots, setSlots] = useState<number>(0);
    const [savingProjectSettings, setSavingProjectSettings] = useState(false);

    // Call Scheduling settings state
    const [schedulingSettings, setSchedulingSettings] = useState<AvailabilitySettings>(DEFAULT_AVAILABILITY_SETTINGS);
    const [savingScheduleSettings, setSavingScheduleSettings] = useState(false);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    // Listen to Project Intake settings
    useEffect(() => {
        if (!db) return;
        let active = true;
        let unsub: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            unsub = onSnapshot(doc(db, "settings", "availability"), (docSnap) => {
                if (!active) return;
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStatus(data.status || "available");
                    setSlots(typeof data.slots === "number" ? data.slots : 0);
                }
            });
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
            if (unsub) unsub();
        };
    }, []);

    // Load scheduling settings
    useEffect(() => {
        async function fetchSettings() {
            const settings = await getAvailabilitySettings();
            setSchedulingSettings(settings);
        }
        fetchSettings();
    }, []);

    // Save project status settings
    const handleSaveProjectSettings = async (newStatus: "available" | "unavailable", newSlots: number) => {
        setSavingProjectSettings(true);
        setStatus(newStatus);
        setSlots(newSlots);
        try {
            await setDoc(doc(db, "settings", "availability"), {
                status: newStatus,
                slots: newSlots
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save project settings:", error);
        }
        setSavingProjectSettings(false);
    };

    // Save call scheduling settings
    const handleSaveScheduleSettings = async (updated: Partial<AvailabilitySettings>) => {
        setSavingScheduleSettings(true);
        const newSettings = { ...schedulingSettings, ...updated };
        setSchedulingSettings(newSettings);
        try {
            await updateAvailabilitySettings(newSettings);
        } catch (error) {
            console.error("Failed to save scheduling settings:", error);
        }
        setSavingScheduleSettings(false);
    };

    // Day of week toggler
    const toggleWorkingDay = (day: string) => {
        const days = schedulingSettings.workingDays.includes(day)
            ? schedulingSettings.workingDays.filter(d => d !== day)
            : [...schedulingSettings.workingDays, day];
        handleSaveScheduleSettings({ workingDays: days });
    };

    // Date Block toggler
    const toggleBlockedDate = (dateStr: string) => {
        const dates = schedulingSettings.blockedDates.includes(dateStr)
            ? schedulingSettings.blockedDates.filter(d => d !== dateStr)
            : [...schedulingSettings.blockedDates, dateStr];
        handleSaveScheduleSettings({ blockedDates: dates });
    };

    // Blocked dates mini-calendar helper variables
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    // Adjust firstDayOfMonth to start week on Monday (0 = Mon, 6 = Sun)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentCalendarDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentCalendarDate(new Date(year, month + 1, 1));
    };

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-1">
                        Settings
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Configure your Brand Studio and availability calendars
                    </p>
                </div>

                {/* Settings Tab Selector */}
                <div className="flex bg-[#5C1500]/10 border border-[#FDF3E6]/10 p-1 rounded-xl self-start md:self-auto font-bold text-xs uppercase tracking-wider">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeTab === "general"
                                ? "bg-orange text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <FiSettings size={14} />
                        General OS
                    </button>
                    <button
                        onClick={() => setActiveTab("scheduling")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeTab === "scheduling"
                                ? "bg-orange text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <FiCalendar size={14} />
                        Call Scheduling
                    </button>
                </div>
            </div>

            <div className="max-w-4xl">
                <AnimatePresence mode="wait">
                    {activeTab === "general" ? (
                        <motion.div
                            key="general"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 max-w-2xl"
                        >
                            {/* Integrations Config */}
                            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-8">
                                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                                    Integrations
                                </h2>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Firebase, Paystack, email, and messaging integrations will be configured here.
                                </p>
                            </div>

                            {/* Project Availability Settings */}
                            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-8">
                                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                                    Project Intake Intake Status
                                    {savingProjectSettings && <span className="text-xs text-orange animate-pulse">Saving...</span>}
                                </h2>

                                <div className="flex flex-col gap-6">
                                    {/* Status Toggle */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">Intake Status</label>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleSaveProjectSettings("available", slots)}
                                                className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${
                                                    status === "available"
                                                        ? "border-green bg-green/10 text-green font-bold"
                                                        : "border-[var(--border-color)] text-[var(--text-secondary)] font-bold hover:border-gray-400"
                                                }`}
                                            >
                                                Taking Projects
                                            </button>
                                            <button
                                                onClick={() => handleSaveProjectSettings("unavailable", slots)}
                                                className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${
                                                    status === "unavailable"
                                                        ? "border-red-500 bg-red-500/10 text-red-500 font-bold"
                                                        : "border-[var(--border-color)] text-[var(--text-secondary)] font-bold hover:border-gray-400"
                                                }`}
                                            >
                                                Fully Booked
                                            </button>
                                        </div>
                                    </div>

                                    {/* Slots Control */}
                                    {status === "available" && (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">Remaining Project Slots (0 = Unlimited)</label>
                                            <div className="flex gap-4 items-center">
                                                <button
                                                    onClick={() => handleSaveProjectSettings(status, Math.max(0, slots - 1))}
                                                    className="w-10 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] font-bold text-[var(--text-primary)] flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="font-mono text-lg w-8 text-center">{slots}</span>
                                                <button
                                                    onClick={() => handleSaveProjectSettings(status, slots + 1)}
                                                    className="w-10 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] font-bold text-[var(--text-primary)] flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="scheduling"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                        >
                            {/* Left Side: General Hours & Duration */}
                            <div className="lg:col-span-6 space-y-6">
                                <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-8">
                                    <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                                        Working Days & Call Hours
                                        {savingScheduleSettings && <span className="text-xs text-orange animate-pulse">Saving...</span>}
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Day Selectors */}
                                        <div>
                                            <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest block mb-3">
                                                Available Days
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {DAYS_OF_WEEK.map((day) => {
                                                    const isChecked = schedulingSettings.workingDays.includes(day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => toggleWorkingDay(day)}
                                                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                                                isChecked
                                                                    ? "bg-orange border-orange text-white"
                                                                    : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-gray-400"
                                                            }`}
                                                        >
                                                            {day.slice(0, 3)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Working Hours */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest block mb-2">
                                                    Start Time
                                                </label>
                                                <select
                                                    value={schedulingSettings.workingHours.start}
                                                    onChange={(e) => handleSaveScheduleSettings({
                                                        workingHours: {
                                                            ...schedulingSettings.workingHours,
                                                            start: e.target.value
                                                        }
                                                    })}
                                                    className="w-full h-11 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-sm text-[var(--text-primary)] outline-none font-bold"
                                                >
                                                    {HOURS.map(h => (
                                                        <option key={h} value={h}>{h}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest block mb-2">
                                                    End Time
                                                </label>
                                                <select
                                                    value={schedulingSettings.workingHours.end}
                                                    onChange={(e) => handleSaveScheduleSettings({
                                                        workingHours: {
                                                            ...schedulingSettings.workingHours,
                                                            end: e.target.value
                                                        }
                                                    })}
                                                    className="w-full h-11 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-sm text-[var(--text-primary)] outline-none font-bold"
                                                >
                                                    {HOURS.map(h => (
                                                        <option key={h} value={h}>{h}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Duration Selection */}
                                        <div>
                                            <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest block mb-2">
                                                Slot Duration
                                            </label>
                                            <select
                                                value={schedulingSettings.duration}
                                                onChange={(e) => handleSaveScheduleSettings({ duration: Number(e.target.value) })}
                                                className="w-full h-11 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-sm text-[var(--text-primary)] outline-none font-bold"
                                            >
                                                {DURATIONS.map(d => (
                                                    <option key={d} value={d}>{d} minutes</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Manual Blocks Mini Calendar */}
                            <div className="lg:col-span-6 space-y-6">
                                <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                                                Manual Date Blocking
                                            </h2>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                                Click any date to block/unblock it for calls
                                            </p>
                                        </div>
                                        {savingScheduleSettings && <span className="text-xs text-orange animate-pulse shrink-0">Saving...</span>}
                                    </div>

                                    {/* Mini Calendar */}
                                    <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--surface)] p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-bold text-[var(--text-primary)]">
                                                {monthNames[month]} {year}
                                            </span>
                                            <div className="flex gap-2 text-[var(--text-secondary)]">
                                                <button
                                                    onClick={prevMonth}
                                                    className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[#5C1500]/5 transition-colors"
                                                >
                                                    <FiChevronLeft size={16} />
                                                </button>
                                                <button
                                                    onClick={nextMonth}
                                                    className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[#5C1500]/5 transition-colors"
                                                >
                                                    <FiChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Week Days Header */}
                                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>

                                        {/* Days Grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {/* Padding empty slots for start of month */}
                                            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                                                <div key={`empty-${i}`} className="aspect-square" />
                                            ))}

                                            {/* Month Days */}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const dayNum = i + 1;
                                                const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                                                const isBlocked = schedulingSettings.blockedDates.includes(dateString);
                                                
                                                // Check if weekday is active in general availability
                                                const tempDate = new Date(year, month, dayNum);
                                                // getDay returns 0=Sun, 1=Mon, ..., 6=Sat
                                                const dayIndex = tempDate.getDay();
                                                const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                                                const isWorkingDay = schedulingSettings.workingDays.includes(DAYS_OF_WEEK[adjustedDayIndex]);

                                                return (
                                                    <button
                                                        key={`day-${dayNum}`}
                                                        onClick={() => toggleBlockedDate(dateString)}
                                                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                                                            isBlocked
                                                                ? "bg-red-500/10 border border-red-500 text-red-500 font-black line-through"
                                                                : isWorkingDay
                                                                ? "bg-green/5 border border-green/20 text-[var(--text-primary)] hover:border-orange"
                                                                : "bg-gray-400/5 text-[var(--text-muted)] hover:border-orange border border-transparent"
                                                        }`}
                                                    >
                                                        {dayNum}
                                                        {isBlocked && (
                                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Blocked Dates list */}
                                    {schedulingSettings.blockedDates.length > 0 && (
                                        <div className="mt-6">
                                            <label className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest block mb-2">
                                                Currently Blocked Dates
                                            </label>
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
                                                {schedulingSettings.blockedDates.map(dateStr => (
                                                    <span
                                                        key={dateStr}
                                                        onClick={() => toggleBlockedDate(dateStr)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors"
                                                    >
                                                        {dateStr}
                                                        <span className="font-bold">×</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
