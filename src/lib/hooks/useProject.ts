"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Project } from "@/lib/types/portfolio";
import { projects as staticProjects } from "@/data/projects";

export function useProject(id: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        // 1. Try to find in static data first (for backward compatibility)
        const staticProj = staticProjects.find(p => p.id.toString() === id);
        if (staticProj) {
            setProject(staticProj as any);
            setLoading(false);
            return;
        }

        // 2. If not in static, fetch from Firestore
        async function fetch() {
            try {
                const docRef = doc(db, "portfolio", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() } as Project);
                } else {
                    setError(new Error("Project not found"));
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [id]);

    return { project, loading, error };
}
