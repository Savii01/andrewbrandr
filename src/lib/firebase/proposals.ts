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
    Timestamp,
} from "firebase/firestore";
import { Proposal, ProposalTemplate } from "@/lib/types/dashboard";

const PROPOSALS = "proposals";
const PROPOSAL_TEMPLATES = "proposalTemplates";

// ─── Templates ───

export async function getProposalTemplates(): Promise<ProposalTemplate[]> {
    const q = query(collection(db, PROPOSAL_TEMPLATES), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ProposalTemplate[];
}

export async function createProposalTemplate(
    data: Omit<ProposalTemplate, "id" | "createdAt" | "updatedAt">
) {
    const docRef = await addDoc(collection(db, PROPOSAL_TEMPLATES), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateProposalTemplate(
    id: string,
    updates: Partial<ProposalTemplate>
) {
    await updateDoc(doc(db, PROPOSAL_TEMPLATES, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteProposalTemplate(id: string) {
    await deleteDoc(doc(db, PROPOSAL_TEMPLATES, id));
}

// ─── Proposals ───

export async function getEngagementProposals(engagementId: string): Promise<Proposal[]> {
    const q = query(
        collection(db, PROPOSALS),
        where("engagementId", "==", engagementId),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Proposal[];
}

export async function createProposal(
    data: Omit<Proposal, "id" | "createdAt" | "updatedAt" | "version" | "versions">
) {
    const docRef = await addDoc(collection(db, PROPOSALS), {
        ...data,
        version: 1,
        versions: [{ content: data.content, savedAt: Timestamp.now() }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateProposal(id: string, updates: Partial<Proposal>) {
    await updateDoc(doc(db, PROPOSALS, id), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Save a new version of the proposal content (append to version history).
 */
export async function saveProposalVersion(id: string, content: string, currentVersion: number) {
    const { arrayUnion: au } = await import("firebase/firestore");
    await updateDoc(doc(db, PROPOSALS, id), {
        content,
        version: currentVersion + 1,
        versions: au({ content, savedAt: Timestamp.now() }),
        updatedAt: serverTimestamp(),
    });
}

export async function deleteProposal(id: string) {
    await deleteDoc(doc(db, PROPOSALS, id));
}
