import { db } from "@/lib/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc,
    arrayUnion,
    Timestamp,
} from "firebase/firestore";
import {
    Engagement,
    EngagementStage,
    EngagementTier,
    ClientProfile,
    ActivityLogEntry,
    StageHistoryEntry,
} from "@/lib/types/dashboard";
import { buildDefaultStages, buildDefaultMilestones } from "@/lib/stage-config";

// ─── Client Management ───

export async function createClient(
    clientData: Omit<ClientProfile, "id" | "createdAt">
) {
    const docRef = await addDoc(collection(db, "clients"), {
        ...clientData,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getClient(id: string): Promise<ClientProfile | null> {
    const snap = await getDoc(doc(db, "clients", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as ClientProfile;
}

// ─── Engagement CRUD ───

export interface CreateEngagementInput {
    clientIds: string[];
    projectName: string;
    tier: EngagementTier;
}

/**
 * Create a new engagement with all 9 stages initialized as not_started.
 * Discovery is set as the primary stage.
 */
export async function createEngagement(input: CreateEngagementInput) {
    const engagement: Omit<Engagement, "id"> = {
        clientIds: input.clientIds,
        projectName: input.projectName,
        tier: input.tier,
        stagePrimary: "discovery",
        stages: buildDefaultStages(),
        milestones: buildDefaultMilestones(),
        stageHistory: [],
        estimatedCompletion: null,
        depositPaid: false,
        contractSigned: false,
        calendarEventIds: [],
        briefUrl: "",
        portalToken: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        notes: "",
        activityLog: [],
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "engagements"), engagement);

    // Log the creation event
    await addActivityLog(docRef.id, "Engagement created", "system");

    return docRef.id;
}

/**
 * Update arbitrary fields on an engagement.
 */
export async function updateEngagement(
    id: string,
    updates: Partial<Omit<Engagement, "id">>
) {
    const docRef = doc(db, "engagements", id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

// ─── Stage Transitions (Manual Only) ───

/**
 * Activate a stage. This does NOT auto-complete any other stage.
 * The caller should have already checked soft dependencies and shown a warning if needed.
 */
export async function activateStage(engagementId: string, stage: EngagementStage) {
    const docRef = doc(db, "engagements", engagementId);
    const now = Timestamp.now();

    await updateDoc(docRef, {
        [`stages.${stage}.status`]: "active",
        [`stages.${stage}.startedAt`]: now,
        stagePrimary: stage,
        updatedAt: now,
        stageHistory: arrayUnion({
            stage,
            action: "activated",
            at: Timestamp.now(),
        } as StageHistoryEntry),
    });

    await addActivityLog(engagementId, `Stage "${stage}" activated`, "system");
}

/**
 * Mark a stage as completed. Must be triggered manually by admin.
 * Milestones do NOT auto-complete stages.
 */
export async function completeStage(engagementId: string, stage: EngagementStage) {
    const docRef = doc(db, "engagements", engagementId);
    const now = Timestamp.now();

    await updateDoc(docRef, {
        [`stages.${stage}.status`]: "completed",
        [`stages.${stage}.completedAt`]: now,
        updatedAt: now,
        stageHistory: arrayUnion({
            stage,
            action: "completed",
            at: Timestamp.now(),
        } as StageHistoryEntry),
    });

    await addActivityLog(engagementId, `Stage "${stage}" completed`, "system");
}

/**
 * Reopen a completed stage (edge case — admin changes their mind).
 */
export async function reopenStage(engagementId: string, stage: EngagementStage) {
    const docRef = doc(db, "engagements", engagementId);
    const now = Timestamp.now();

    await updateDoc(docRef, {
        [`stages.${stage}.status`]: "active",
        [`stages.${stage}.completedAt`]: null,
        updatedAt: now,
        stageHistory: arrayUnion({
            stage,
            action: "reopened",
            at: Timestamp.now(),
        } as StageHistoryEntry),
    });

    await addActivityLog(engagementId, `Stage "${stage}" reopened`, "system");
}

// ─── Milestone Tracking ───

/**
 * Toggle a single milestone within a stage.
 */
export async function toggleMilestone(
    engagementId: string,
    stage: EngagementStage,
    milestoneKey: string,
    completed: boolean
) {
    const docRef = doc(db, "engagements", engagementId);
    await updateDoc(docRef, {
        [`milestones.${stage}.${milestoneKey}`]: completed,
        updatedAt: Timestamp.now(),
    });
}

// ─── Notes & Activity Log ───

/**
 * Save engagement-level notes (overwrites).
 */
export async function updateNotes(engagementId: string, notes: string) {
    const docRef = doc(db, "engagements", engagementId);
    await updateDoc(docRef, {
        notes,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Append an entry to the activity log.
 */
export async function addActivityLog(
    engagementId: string,
    entry: string,
    type: "system" | "manual"
) {
    const docRef = doc(db, "engagements", engagementId);
    await updateDoc(docRef, {
        activityLog: arrayUnion({
            entry,
            at: Timestamp.now(),
            type,
        } as ActivityLogEntry),
    });
}

// ─── Integration Fields ───

export async function setDriveFolderId(engagementId: string, folderId: string) {
    await updateEngagement(engagementId, { driveFolderId: folderId });
    await addActivityLog(engagementId, "Google Drive folder linked", "system");
}

export async function addCalendarEventId(engagementId: string, eventId: string) {
    const docRef = doc(db, "engagements", engagementId);
    await updateDoc(docRef, {
        calendarEventIds: arrayUnion(eventId),
        updatedAt: Timestamp.now(),
    });
    await addActivityLog(engagementId, "Calendar event linked", "system");
}

export async function setFeedbackForm(
    engagementId: string,
    formId: string,
    sheetId: string
) {
    await updateEngagement(engagementId, {
        feedbackFormId: formId,
        feedbackSheetId: sheetId,
    });
    await addActivityLog(engagementId, "Feedback form generated and linked", "system");
}

// ─── Commercial Flags ───

export async function markDepositPaid(engagementId: string) {
    await updateEngagement(engagementId, { depositPaid: true });
    await addActivityLog(engagementId, "Deposit marked as paid", "system");
}

export async function markContractSigned(engagementId: string) {
    await updateEngagement(engagementId, { contractSigned: true });
    await addActivityLog(engagementId, "Contract marked as signed", "system");
}

/**
 * Update studio-wide stats document.
 * NOTE: In production, use Cloud Functions for atomic increments.
 */
export async function updateStudioStats(updates: Record<string, any>) {
    const docRef = doc(db, "metadata", "studio_stats");
    await updateDoc(docRef, updates);
}
