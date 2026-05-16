import { db } from "@/lib/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { Invoice, Retainer } from "@/lib/types/dashboard";

const INVOICES = "invoices";
const RETAINERS = "retainers";

// ─── Invoices ───

export async function getEngagementInvoices(engagementId: string): Promise<Invoice[]> {
    const q = query(
        collection(db, INVOICES),
        where("engagementId", "==", engagementId),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[];
}

export async function getAllInvoices(): Promise<Invoice[]> {
    const q = query(collection(db, INVOICES), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[];
}

export async function createInvoice(
    data: Omit<Invoice, "id" | "createdAt" | "updatedAt">
) {
    const docRef = await addDoc(collection(db, INVOICES), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
    await updateDoc(doc(db, INVOICES, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function markInvoicePaid(id: string, paymentRef?: string) {
    await updateDoc(doc(db, INVOICES, id), {
        status: "paid",
        paidAt: serverTimestamp(),
        paymentRef: paymentRef || "",
        updatedAt: serverTimestamp(),
    });
}

export async function deleteInvoice(id: string) {
    await deleteDoc(doc(db, INVOICES, id));
}

// ─── Retainers ───

export async function getEngagementRetainers(engagementId: string): Promise<Retainer[]> {
    const q = query(
        collection(db, RETAINERS),
        where("engagementId", "==", engagementId),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Retainer[];
}

export async function getAllRetainers(): Promise<Retainer[]> {
    const q = query(collection(db, RETAINERS), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Retainer[];
}

export async function createRetainer(
    data: Omit<Retainer, "id" | "createdAt" | "updatedAt">
) {
    const docRef = await addDoc(collection(db, RETAINERS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateRetainer(id: string, updates: Partial<Retainer>) {
    await updateDoc(doc(db, RETAINERS, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}
