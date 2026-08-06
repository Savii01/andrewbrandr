"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBookings, updateBookingStatus, Booking } from "@/lib/firebase/bookings";
import { FiCalendar, FiClock, FiMail, FiUser, FiGlobe, FiAlertCircle, FiCheck, FiX, FiMessageSquare } from "react-icons/fi";

export default function BookingsManagerPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Fetch bookings on load
    const fetchBookingsList = async () => {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookingsList();
    }, []);

    // Get today's date in YYYY-MM-DD local format
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const todayStr = getTodayString();

    // Filter bookings based on activeTab
    const filteredBookings = bookings.filter(b => {
        if (activeTab === "cancelled") {
            return b.status === "cancelled";
        }
        
        // If not cancelled, check date
        const isPast = b.date < todayStr;
        
        if (activeTab === "past") {
            return isPast && b.status !== "cancelled";
        }
        
        // Upcoming: date >= today and status is not cancelled
        return !isPast && b.status !== "cancelled";
    });

    const handleStatusChange = async (id: string, newStatus: "confirmed" | "cancelled") => {
        setProcessingId(id);
        try {
            await updateBookingStatus(id, newStatus);
            // Refresh list
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
        setProcessingId(null);
    };

    // Format date string for display
    const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr + "T00:00:00");
        return dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Format time string for display (12-hour format)
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-1">
                        Bookings Manager
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Manage scheduled client discovery and strategy sessions
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-[#5C1500]/10 border border-[#FDF3E6]/10 p-1 rounded-xl font-bold text-xs uppercase tracking-wider">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            activeTab === "upcoming"
                                ? "bg-orange text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            activeTab === "past"
                                ? "bg-orange text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setActiveTab("cancelled")}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            activeTab === "cancelled"
                                ? "bg-orange text-white"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 animate-pulse space-y-4">
                            <div className="h-6 bg-[var(--surface-elevated)] rounded w-1/3" />
                            <div className="h-4 bg-[var(--surface-elevated)] rounded w-2/3" />
                            <div className="h-4 bg-[var(--surface-elevated)] rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-6 flex flex-col justify-between hover:border-orange/20 transition-all ${
                                    booking.status === "cancelled" ? "opacity-60" : ""
                                }`}
                            >
                                <div>
                                    {/* Card Header (Date & Time) */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 text-xs text-orange font-bold uppercase tracking-wider">
                                                <FiCalendar size={14} />
                                                {formatDate(booking.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-lg text-[var(--text-primary)] font-mono font-bold">
                                                <FiClock size={16} />
                                                {formatTime(booking.time)}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                            booking.status === "confirmed"
                                                ? "bg-green/10 text-green border-green/20"
                                                : booking.status === "cancelled"
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-orange/10 text-orange border-orange/20"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="h-[1px] bg-[var(--border-color)] w-full mb-4" />

                                    {/* Client info */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-bold">
                                            <FiUser className="text-[var(--text-muted)] flex-shrink-0" size={14} />
                                            {booking.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                            <FiMail className="text-[var(--text-muted)] flex-shrink-0" size={14} />
                                            <a href={`mailto:${booking.email}`} className="hover:text-orange transition-colors">
                                                {booking.email}
                                            </a>
                                        </div>
                                        {booking.timezone && (
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                                                <FiGlobe className="flex-shrink-0" size={12} />
                                                Client Zone: {booking.timezone}
                                            </div>
                                        )}
                                    </div>

                                    {/* Client Brief/Notes */}
                                    {booking.notes && (
                                        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-3.5 mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)] mb-1">
                                                <FiMessageSquare size={12} />
                                                Client Message
                                            </div>
                                            {booking.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Actions footer */}
                                {booking.status !== "cancelled" && activeTab === "upcoming" && (
                                    <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                                        {booking.status === "pending" && (
                                            <button
                                                disabled={processingId === booking.id}
                                                onClick={() => handleStatusChange(booking.id!, "confirmed")}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-green hover:bg-green-600 transition-colors disabled:opacity-50"
                                            >
                                                <FiCheck size={14} />
                                                Confirm Call
                                            </button>
                                        )}
                                        <button
                                            disabled={processingId === booking.id}
                                            onClick={() => handleStatusChange(booking.id!, "cancelled")}
                                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                                                booking.status === "pending"
                                                    ? "border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                                    : "flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white hover:bg-red-600"
                                            } disabled:opacity-50`}
                                        >
                                            <FiX size={14} className={booking.status === "confirmed" ? "inline" : ""} />
                                            {booking.status === "confirmed" ? "Cancel Session" : "Cancel"}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface-elevated)] p-16 text-center">
                    <FiAlertCircle size={40} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <p className="text-[var(--text-primary)] text-sm font-bold uppercase tracking-wider">No {activeTab} bookings found</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        When clients schedule calls from the public discovery page, they will show up here.
                    </p>
                </div>
            )}
        </div>
    );
}
