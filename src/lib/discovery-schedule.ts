import { getAvailabilitySettings } from "@/lib/firebase/availability";
import { getBookedSlotsForDate } from "@/lib/firebase/bookings";

export interface DiscoverySlot {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    /** ISO 8601 UTC instant combining date + time in the local timezone */
    dateTime: string;
    durationMinutes: number;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const pad = (n: number) => String(n).padStart(2, "0");

const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Finds the next available discovery call slot based on the studio's
 * availability settings, skipping blocked dates and already-booked times.
 * Scans from tomorrow up to `maxDaysAhead` days.
 */
export async function getNextDiscoverySlot(maxDaysAhead = 30): Promise<DiscoverySlot | null> {
    const settings = await getAvailabilitySettings();
    const { workingDays, workingHours, duration, blockedDates } = settings;

    const [startH, startM] = workingHours.start.split(":").map(Number);
    const [endH, endM] = workingHours.end.split(":").map(Number);

    const today = new Date();

    for (let offset = 1; offset <= maxDaysAhead; offset++) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
        const dayOfWeek = day.getDay();
        const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        if (!workingDays.includes(DAYS_OF_WEEK[adjustedDayIndex])) continue;

        const dateStr = toDateStr(day);
        if (blockedDates.includes(dateStr)) continue;

        let booked: string[] = [];
        try {
            booked = await getBookedSlotsForDate(dateStr);
        } catch {
            booked = [];
        }

        let curH = startH;
        let curM = startM;

        while (curH < endH || (curH === endH && curM < endM)) {
            const slotStr = `${pad(curH)}:${pad(curM)}`;
            if (!booked.includes(slotStr)) {
                const slotDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), curH, curM);
                return {
                    date: dateStr,
                    time: slotStr,
                    dateTime: slotDate.toISOString(),
                    durationMinutes: duration,
                };
            }
            curM += duration;
            if (curM >= 60) {
                curH += Math.floor(curM / 60);
                curM = curM % 60;
            }
        }
    }

    return null;
}
