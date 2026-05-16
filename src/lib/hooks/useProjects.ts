"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/lib/firebase/portfolio";
import { Project } from "@/lib/types/portfolio";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetch() {
            try {
                const data = await getProjects(false); // Public only
                setProjects(data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    return { projects, loading, error };
}
