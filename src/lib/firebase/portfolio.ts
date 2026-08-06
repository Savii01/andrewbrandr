import { db } from "@/lib/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    deleteDoc
} from "firebase/firestore";
import { Project } from "@/lib/types/portfolio";
import { projects as staticProjects } from "@/data/projects";

const COLLECTION_NAME = "portfolio";

/**
 * Get all projects ordered by the 'order' field.
 * Auto-seeds the database with static projects if the collection is empty.
 */
export async function getProjects(includePrivate = false) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    let querySnapshot = await getDocs(q);
    
    // Auto-seed if collection is empty
    if (querySnapshot.empty) {
        console.log("Portfolio collection empty — seeding with static projects...");
        for (const p of staticProjects) {
            await addDoc(collection(db, COLLECTION_NAME), {
                slug: p.slug,
                name: p.name,
                client: p.client,
                industry: p.industry || "",
                year: p.year,
                stage: p.stage,
                coverImage: p.coverImage,
                services: p.services,
                context: p.context,
                problem: p.problem,
                strategy: p.strategy,
                strategyImages: p.strategyImages || [],
                creativeDirection: p.creativeDirection,
                creativeDirectionImages: p.creativeDirectionImages || [],
                identitySystem: p.identitySystem,
                identitySystemImages: p.identitySystemImages || [],
                outcome: p.outcome,
                website: p.website || "",
                behance: p.behance || "",
                testimonial: p.testimonial || null,
                isPublic: true,
                order: p.id,
                createdAt: serverTimestamp()
            });
        }
        // Refetch after seeding
        querySnapshot = await getDocs(q);
    }
    
    const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Project[];

    if (!includePrivate) {
        return projects.filter(p => p.isPublic);
    }
    
    return projects;
}

/**
 * Create a new portfolio project
 */
export async function createProject(projectData: Omit<Project, "id" | "createdAt">) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...projectData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Update a project
 */
export async function updateProject(id: string, updates: Partial<Project>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Delete a project
 */
export async function deleteProject(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
