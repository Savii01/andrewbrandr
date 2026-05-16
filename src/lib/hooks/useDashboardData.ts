import { db } from "@/lib/firebase/config";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    limit,
    doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import {
    Engagement,
    StudioStats,
    EngagementStage,
    Proposal,
    Invoice,
} from "@/lib/types/dashboard";
import { STAGE_CONFIG } from "@/lib/stage-config";

// ─── Active Engagements (list view + Kanban) ───

export function useActiveEngagements() {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, "engagements"),
            where("status", "==", "active"),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Engagement[];
                setEngagements(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching engagements:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { engagements, loading };
}

// ─── Single Engagement (real-time stream) ───

export function useEngagement(id: string | null) {
    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !id) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "engagements", id),
            (snapshot) => {
                if (snapshot.exists()) {
                    setEngagement({
                        id: snapshot.id,
                        ...snapshot.data(),
                    } as Engagement);
                } else {
                    setEngagement(null);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching engagement:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [id]);

    return { engagement, loading };
}

// ─── Client Portal (token-based access) ───

export function usePortalEngagement(token: string | null) {
    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !token) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "engagements"),
            where("portalToken", "==", token),
            limit(1)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    setEngagement({
                        id: doc.id,
                        ...doc.data(),
                    } as Engagement);
                } else {
                    setEngagement(null);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching portal engagement:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [token]);

    return { engagement, loading };
}

// ─── Studio Stats ───

export function useStudioStats() {
    const [stats, setStats] = useState<StudioStats>({
        activeEngagementsCount: 0,
        monthlyRevenue: 0,
        unpaidInvoicesCount: 0,
        unpaidAmount: 0,
        pendingApprovalsCount: 0,
        urgentAlertsCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const unsubscribe = onSnapshot(
            collection(db, "metadata"),
            (snapshot) => {
                const statsDoc = snapshot.docs.find(
                    (doc) => doc.id === "studio_stats"
                );
                if (statsDoc) {
                    setStats(statsDoc.data() as StudioStats);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching studio stats:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { stats, loading };
}

// ─── Pending Briefs ───

export function usePendingBriefs() {
    const [briefs, setBriefs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, "briefs"),
            where("status", "==", "pending"),
            limit(20)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                }));
                setBriefs(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching briefs:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { briefs, loading };
}

// ─── Engagement Proposals ───

export function useEngagementProposals(engagementId: string | null) {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !engagementId) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "proposals"),
            where("engagementId", "==", engagementId)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as Proposal[];
                setProposals(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching proposals:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [engagementId]);

    return { proposals, loading };
}

// ─── Engagement Invoices ───

export function useEngagementInvoices(engagementId: string | null) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !engagementId) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "invoices"),
            where("engagementId", "==", engagementId)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as Invoice[];
                setInvoices(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching invoices:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [engagementId]);

    return { invoices, loading };
}

// ─── Progress Utilities ───

/**
 * Macro progress: completed stages / total stages.
 * Used on Kanban cards and overview.
 */
export function getMacroProgress(engagement: Engagement): number {
    const stages = Object.values(engagement.stages);
    const completed = stages.filter((s) => s.status === "completed").length;
    return Math.round((completed / stages.length) * 100);
}

/**
 * Micro progress: completed milestones / total milestones for a specific stage.
 * Used inside stage detail views.
 */
export function getMicroProgress(
    engagement: Engagement,
    stage: EngagementStage
): number {
    const milestones = engagement.milestones?.[stage];
    if (!milestones) return 0;

    const total = Object.keys(milestones).length;
    if (total === 0) return 0;

    const completed = Object.values(milestones).filter(Boolean).length;
    return Math.round((completed / total) * 100);
}

/**
 * Count of active stages (for badges, etc.).
 */
export function getActiveStageCount(engagement: Engagement): number {
    return Object.values(engagement.stages).filter(
        (s) => s.status === "active"
    ).length;
}
