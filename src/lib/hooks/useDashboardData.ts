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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const q = query(
                collection(db, "engagements"),
                where("status", "==", "active"),
                limit(50)
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    if (!active) return;
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Engagement[];
                    setEngagements(data);
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching engagements:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            unsubscribe = onSnapshot(
                doc(db, "engagements", id),
                (snapshot) => {
                    if (!active) return;
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
                    if (!active) return;
                    console.error("Error fetching engagement:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const q = query(
                collection(db, "engagements"),
                where("portalToken", "==", token),
                limit(1)
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    if (!active) return;
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
                    if (!active) return;
                    console.error("Error fetching portal engagement:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            unsubscribe = onSnapshot(
                collection(db, "metadata"),
                (snapshot) => {
                    if (!active) return;
                    const statsDoc = snapshot.docs.find(
                        (doc) => doc.id === "studio_stats"
                    );
                    if (statsDoc) {
                        setStats(statsDoc.data() as StudioStats);
                    }
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching studio stats:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const q = query(
                collection(db, "briefs"),
                where("status", "==", "pending"),
                limit(20)
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    if (!active) return;
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate() || new Date(),
                    }));
                    setBriefs(data);
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching briefs:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { briefs, loading };
}

// ─── In-System Notifications (pending briefs + pending bookings) ───

export interface SystemNotification {
    id: string;
    type: "brief" | "booking";
    title: string;
    subtitle: string;
    date: Date;
    href: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<SystemNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        let active = true;
        const unsubs: (() => void)[] = [];

        const timer = setTimeout(() => {
            const briefsQ = query(
                collection(db, "briefs"),
                where("status", "==", "pending"),
                limit(10)
            );
            const bookingsQ = query(
                collection(db, "bookings"),
                where("status", "==", "pending"),
                limit(10)
            );

            const briefUnsub = onSnapshot(
                briefsQ,
                (snapshot) => {
                    if (!active) return;
                    const briefNotifs: SystemNotification[] = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: `brief-${doc.id}`,
                            type: "brief",
                            title: data.brief?.businessName || "New brief received",
                            subtitle: `New ${data.plan || "branding"} project brief from ${data.lead?.fullName || "a new client"}`,
                            date: data.createdAt?.toDate() || new Date(),
                            href: "/dashboard/briefs",
                        };
                    });
                    setNotifications((prev) => mergeNotifications(briefNotifs, prev.filter((n) => n.type !== "brief")));
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching notification briefs:", error);
                    setLoading(false);
                }
            );

            const bookingUnsub = onSnapshot(
                bookingsQ,
                (snapshot) => {
                    if (!active) return;
                    const bookingNotifs: SystemNotification[] = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: `booking-${doc.id}`,
                            type: "booking",
                            title: data.name || "New booking",
                            subtitle: `Discovery call requested${data.date ? ` on ${data.date}` : ""} at ${data.time || ""}`,
                            date: data.createdAt?.toDate() || new Date(),
                            href: "/dashboard/bookings",
                        };
                    });
                    setNotifications((prev) => mergeNotifications(prev.filter((n) => n.type !== "booking"), bookingNotifs));
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching notification bookings:", error);
                    setLoading(false);
                }
            );

            unsubs.push(briefUnsub, bookingUnsub);
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
            unsubs.forEach((unsub) => unsub());
        };
    }, []);

    return { notifications, unreadCount: notifications.length, loading };
}

function mergeNotifications(
    list: SystemNotification[],
    rest: SystemNotification[]
): SystemNotification[] {
    return [...list, ...rest]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 12);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const q = query(
                collection(db, "proposals"),
                where("engagementId", "==", engagementId)
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    if (!active) return;
                    const data = snapshot.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    })) as Proposal[];
                    setProposals(data);
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching proposals:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
        let active = true;
        let unsubscribe: (() => void) | undefined;

        const timer = setTimeout(() => {
            if (!active) return;
            const q = query(
                collection(db, "invoices"),
                where("engagementId", "==", engagementId)
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    if (!active) return;
                    const data = snapshot.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    })) as Invoice[];
                    setInvoices(data);
                    setLoading(false);
                },
                (error) => {
                    if (!active) return;
                    console.error("Error fetching invoices:", error);
                    setLoading(false);
                }
            );
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
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
    if (!engagement.stages) return 0;
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
    if (!engagement.stages) return 0;
    return Object.values(engagement.stages).filter(
        (s) => s.status === "active"
    ).length;
}
