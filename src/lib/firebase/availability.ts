import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";

export interface AvailabilitySettings {
    workingDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    workingHours: {
        start: string; // e.g. '09:00'
        end: string; // e.g. '17:00'
    };
    duration: number; // in minutes, e.g. 30
    blockedDates: string[]; // e.g. ['2026-07-04']
}

export const DEFAULT_AVAILABILITY_SETTINGS: AvailabilitySettings = {
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: { start: "09:00", end: "17:00" },
    duration: 30,
    blockedDates: []
};

export async function getAvailabilitySettings(): Promise<AvailabilitySettings> {
    if (!db) return DEFAULT_AVAILABILITY_SETTINGS;
    try {
        const docRef = doc(db, "availability", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                workingDays: data.workingDays || DEFAULT_AVAILABILITY_SETTINGS.workingDays,
                workingHours: data.workingHours || DEFAULT_AVAILABILITY_SETTINGS.workingHours,
                duration: typeof data.duration === 'number' ? data.duration : DEFAULT_AVAILABILITY_SETTINGS.duration,
                blockedDates: data.blockedDates || DEFAULT_AVAILABILITY_SETTINGS.blockedDates
            };
        }
    } catch (error) {
        console.error("Error fetching availability settings:", error);
    }
    return DEFAULT_AVAILABILITY_SETTINGS;
}

export async function updateAvailabilitySettings(settings: Partial<AvailabilitySettings>): Promise<void> {
    if (!db) return;
    try {
        const docRef = doc(db, "availability", "settings");
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error updating availability settings:", error);
        throw error;
    }
}
