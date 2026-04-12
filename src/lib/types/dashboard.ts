export type EngagementTier = "Starter" | "Growth" | "Premium";
export type EngagementPhase = "Strategy" | "Design" | "Systems" | "Execution";
export type EngagementStatus = "active" | "paused" | "completed";

export interface ClientProfile {
    id: string;
    name: string;
    email: string;
    industry?: string;
    avatar?: string;
    createdAt: any; // Firestore Timestamp
}

export interface Engagement {
    id: string;
    clientId: string;
    clientName: string; // Denormalized for dashboard performance
    tier: EngagementTier;
    phase: EngagementPhase;
    status: EngagementStatus;
    progress: number;
    startDate: any;
    endDate?: any;
    autoRenew: boolean;
    revenue: number; // Value of this engagement
}

export interface StudioStats {
    activeEngagementsCount: number;
    monthlyRevenue: number;
    unpaidInvoicesCount: number;
    unpaidAmount: number;
    pendingApprovalsCount: number;
    urgentAlertsCount: number;
}
