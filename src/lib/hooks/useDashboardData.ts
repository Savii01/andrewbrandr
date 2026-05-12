import { db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Engagement, StudioStats } from "@/lib/types/dashboard";

/**
 * Hook to stream active engagements for the dashboard
 */
export function useActiveEngagements() {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "engagements"),
            where("status", "==", "active"),
            orderBy("progress", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Engagement[];
            setEngagements(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching engagements:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { engagements, loading };
}

/**
 * Hook to stream studio-wide stats
 * 
 * TODO: In a production environment, some of these would be calculated 
 * via Cloud Functions and stored in a 'metadata' or 'stats' document
 * to avoid expensive client-side aggregations.
 */
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
        // Listening to a single 'dashboard_stats' document for performance
        const unsubscribe = onSnapshot(collection(db, "metadata"), (snapshot) => {
            const statsDoc = snapshot.docs.find(doc => doc.id === "studio_stats");
            if (statsDoc) {
                setStats(statsDoc.data() as StudioStats);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching studio stats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { stats, loading };
}

/**
 * Hook to stream pending onboarding briefs
 */
export function usePendingBriefs() {
    const [briefs, setBriefs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "briefs"),
            where("status", "==", "pending"),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            }));
            setBriefs(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching briefs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { briefs, loading };
}
