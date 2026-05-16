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
import { Contract, ContractTemplate } from "@/lib/types/dashboard";

const CONTRACTS = "contracts";
const CONTRACT_TEMPLATES = "contractTemplates";

// ─── Templates ───

export async function getContractTemplates(): Promise<ContractTemplate[]> {
    const q = query(collection(db, CONTRACT_TEMPLATES), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ContractTemplate[];
}

export async function createContractTemplate(
    data: Omit<ContractTemplate, "id" | "createdAt" | "updatedAt">
) {
    const docRef = await addDoc(collection(db, CONTRACT_TEMPLATES), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateContractTemplate(
    id: string,
    updates: Partial<ContractTemplate>
) {
    await updateDoc(doc(db, CONTRACT_TEMPLATES, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteContractTemplate(id: string) {
    await deleteDoc(doc(db, CONTRACT_TEMPLATES, id));
}

// ─── Contracts ───

export async function getEngagementContracts(engagementId: string): Promise<Contract[]> {
    const q = query(
        collection(db, CONTRACTS),
        where("engagementId", "==", engagementId),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contract[];
}

export async function createContract(
    data: Omit<Contract, "id" | "createdAt" | "updatedAt">
) {
    const docRef = await addDoc(collection(db, CONTRACTS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateContract(id: string, updates: Partial<Contract>) {
    await updateDoc(doc(db, CONTRACTS, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteContract(id: string) {
    await deleteDoc(doc(db, CONTRACTS, id));
}
