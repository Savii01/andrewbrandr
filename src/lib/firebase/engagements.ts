import { db } from "@/lib/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc,
    setDoc
} from "firebase/firestore";
import { Engagement, ClientProfile } from "@/lib/types/dashboard";

/**
 * Create a new client profile
 */
export async function createClient(clientData: Omit<ClientProfile, "id" | "createdAt">) {
    const docRef = await addDoc(collection(db, "clients"), {
        ...clientData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Start a new studio engagement
 */
export async function createEngagement(engagementData: Omit<Engagement, "id" | "startDate">) {
    // We denormalize clientName into engagement for dashboard performance
    const docRef = await addDoc(collection(db, "engagements"), {
        ...engagementData,
        startDate: serverTimestamp(),
    });

    // Initialize the phases collection for this engagement
    const phases = ["Strategy", "Design", "Systems", "Execution"];
    for (const phaseType of phases) {
        const phaseId = `${docRef.id}_${phaseType.toLowerCase()}`;
        await setDoc(doc(db, "phases", phaseId), {
            engagementId: docRef.id,
            phaseType,
            mode: "template",
            content: "",
            updatedAt: serverTimestamp(),
        });
    }

    return docRef.id;
}

/**
 * Update engagement progress or phase
 */
export async function updateEngagement(id: string, updates: Partial<Engagement>) {
    const docRef = doc(db, "engagements", id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update studio-wide stats
 * 
 * NOTE: In a production app, use Firestore triggers/Cloud Functions 
 * to increment/decrement these instead of manual updates.
 */
export async function updateStudioStats(updates: any) {
    const docRef = doc(db, "metadata", "studio_stats");
    await updateDoc(docRef, updates);
}
