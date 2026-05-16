import { Timestamp } from "firebase/firestore";

// ─── Stage Lifecycle ───

export const ENGAGEMENT_STAGES = [
    "discovery",
    "proposal",
    "strategy",
    "creativeDirection",
    "identity",
    "presentation",
    "delivery",
    "offboarding",
    "followUp",
] as const;

export type EngagementStage = (typeof ENGAGEMENT_STAGES)[number];

export type StageStatus = "not_started" | "active" | "completed";

export interface StageState {
    status: StageStatus;
    startedAt?: Timestamp | null;
    completedAt?: Timestamp | null;
}

// ─── Engagement Tiers (kept for pricing/commercial context) ───

export type EngagementTier = "Foundation" | "Clarity" | "Scale" | "Enterprise";

// ─── Core Engagement Document ───

export interface StageHistoryEntry {
    stage: EngagementStage;
    action: "activated" | "completed" | "reopened";
    at: Timestamp;
}

export interface ActivityLogEntry {
    entry: string;
    at: Timestamp;
    type: "system" | "manual";
}

export interface Engagement {
    id: string;
    clientIds: string[];
    projectName: string;
    tier: EngagementTier;

    // Stage system
    stagePrimary: EngagementStage;
    stages: Record<EngagementStage, StageState>;
    milestones: Record<EngagementStage, Record<string, boolean>>;
    stageHistory: StageHistoryEntry[];

    // Timeline
    estimatedCompletion?: Timestamp | null;

    // Commercial flags
    depositPaid: boolean;
    contractSigned: boolean;

    // Integrations
    driveFolderId?: string;
    briefUrl?: string;
    portalToken?: string;
    calendarEventIds: string[];
    feedbackFormId?: string;
    feedbackSheetId?: string;

    // Notes & logs
    notes: string;
    activityLog: ActivityLogEntry[];

    // Meta
    status: "active" | "paused" | "completed" | "archived";
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── Client Profile ───

export interface ClientProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    industry?: string;
    avatar?: string;
    currency?: "ngn" | "usd";
    createdAt: Timestamp;
}

// ─── Proposals ───

export interface ProposalTemplate {
    id: string;
    name: string;
    stage: EngagementStage;
    content: string; // Markdown or structured content
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Proposal {
    id: string;
    engagementId: string;
    templateId?: string;
    title: string;
    content: string;
    status: "draft" | "sent" | "accepted" | "rejected";
    version: number;
    versions: { content: string; savedAt: Timestamp }[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── Contracts ───

export interface ContractTemplate {
    id: string;
    name: string;
    stage: EngagementStage;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Contract {
    id: string;
    engagementId: string;
    proposalId?: string; // Contract must reference a proposal
    templateId?: string;
    title: string;
    content: string;
    status: "draft" | "sent" | "signed" | "expired";
    signedFileUrl?: string;
    signedAt?: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── Invoices ───

export interface Invoice {
    id: string;
    engagementId: string;
    contractId?: string;
    type: "deposit" | "milestone" | "final" | "retainer";
    amount: number;
    currency: "ngn" | "usd";
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    dueDate?: Timestamp | null;
    paidAt?: Timestamp | null;
    paymentRef?: string;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── Retainers ───

export interface Retainer {
    id: string;
    engagementId: string;
    clientId: string;
    amount: number;
    currency: "ngn" | "usd";
    frequency: "monthly" | "quarterly";
    status: "active" | "paused" | "cancelled";
    nextDueDate?: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── Studio Stats (aggregated) ───

export interface StudioStats {
    activeEngagementsCount: number;
    monthlyRevenue: number;
    unpaidInvoicesCount: number;
    unpaidAmount: number;
    pendingApprovalsCount: number;
    urgentAlertsCount: number;
}
