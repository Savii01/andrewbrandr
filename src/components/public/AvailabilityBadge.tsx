"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function AvailabilityBadge() {
    const [status, setStatus] = useState<"available" | "unavailable">("available");
    const [slots, setSlots] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        let active = true;
        let unsub: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const docRef = doc(db, "settings", "availability");
            unsub = onSnapshot(docRef, (docSnap) => {
                if (!active) return;
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStatus(data.status || "available");
                    setSlots(typeof data.slots === "number" ? data.slots : 0);
                } else {
                    setStatus("available");
                    setSlots(0);
                }
                setLoading(false);
            }, (error) => {
                if (!active) return;
                console.error("Error fetching availability:", error);
                setLoading(false);
            });
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
            if (unsub) unsub();
        };
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse flex justify-center items-center gap-2 bg-transparent border border-black/20 px-4 py-2 rounded-full opacity-50">
                <div className="bg-gray-400 rounded-full w-2 h-2"></div>
                <p className="text-black text-[12px] md:text-[14px] font-bold tracking-wide">
                    Loading...
                </p>
            </div>
        );
    }

    const isAvailable = status === "available" || slots > 0;
    const dotColor = isAvailable ? "bg-[#cc3300]" : "bg-gray-500";

    let text = "Currently taking on new projects";
    if (!isAvailable) {
        text = "Fully Booked";
    } else if (slots > 0) {
        text = `${slots} Slot${slots === 1 ? "" : "s"} Remaining`;
    }

    return (
        <div className={`flex justify-center items-center gap-2 bg-transparent border border-[#cc3300]/40 px-4 py-2.5 rounded-full ${isAvailable ? "animate-pulse-soft" : ""}`}>
            <div className={`${dotColor} rounded-full w-2.5 h-2.5`}></div>
            <p className="text-[#fdf3e6] text-[13px] font-medium">
                {text}
            </p>
        </div>
    );
}
