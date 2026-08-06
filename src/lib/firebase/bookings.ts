import { db } from "@/lib/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    deleteDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    where,
    runTransaction
} from "firebase/firestore";

export interface Booking {
    id?: string;
    name: string;
    email: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    status: "pending" | "confirmed" | "cancelled";
    timezone?: string;
    notes?: string;
    createdAt?: any;
    updatedAt?: any;
}

const COLLECTION_NAME = "bookings";

/**
 * Creates a booking atomically using a transaction.
 * Also locks the selected slot in the public 'booked_slots' collection to prevent double booking.
 */
export async function createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status">) {
    if (!db) return "";
    try {
        const { date, time } = bookingData;
        const slotId = `${date}_${time}`;
        
        const bookingId = await runTransaction(db, async (transaction) => {
            const slotDocRef = doc(db, "booked_slots", slotId);
            const slotDocSnap = await transaction.get(slotDocRef);
            
            // Check if slot is already booked
            if (slotDocSnap.exists()) {
                throw new Error("This slot is already booked. Please choose another time.");
            }
            
            // Create booking doc ref
            const bookingsColRef = collection(db, COLLECTION_NAME);
            const newBookingRef = doc(bookingsColRef);
            
            // Set booking details
            transaction.set(newBookingRef, {
                ...bookingData,
                status: "pending",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            // Lock the slot
            transaction.set(slotDocRef, {
                date,
                time,
                bookingId: newBookingRef.id,
                createdAt: serverTimestamp()
            });
            
            return newBookingRef.id;
        });
        
        return bookingId;
    } catch (error) {
        console.error("Error creating booking in transaction:", error);
        throw error;
    }
}

/**
 * Admin method to retrieve all bookings sorted by date/time.
 */
export async function getBookings(): Promise<Booking[]> {
    if (!db) return [];
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("date", "asc"), orderBy("time", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Booking[];
    } catch (error) {
        console.error("Error getting bookings:", error);
        return [];
    }
}

/**
 * Public method to get list of booked/busy times for a specific date.
 */
export async function getBookedSlotsForDate(date: string): Promise<string[]> {
    if (!db) return [];
    try {
        const q = query(collection(db, "booked_slots"), where("date", "==", date));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data().time as string);
    } catch (error) {
        console.error("Error getting booked slots for date:", error);
        return [];
    }
}

/**
 * Admin method to update booking status.
 * If status is updated to 'cancelled', it frees up the time slot.
 */
export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
    if (!db) return;
    try {
        const bookingRef = doc(db, COLLECTION_NAME, id);
        
        if (status === "cancelled") {
            const bookingSnap = await getDoc(bookingRef);
            if (bookingSnap.exists()) {
                const data = bookingSnap.data();
                const slotId = `${data.date}_${data.time}`;
                const slotDocRef = doc(db, "booked_slots", slotId);
                await deleteDoc(slotDocRef);
            }
        }
        
        await updateDoc(bookingRef, {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        throw error;
    }
}
