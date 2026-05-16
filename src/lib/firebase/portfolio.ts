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

const COLLECTION_NAME = "portfolio";

/**
 * Get all projects ordered by the 'order' field
 */
export async function getProjects(includePrivate = false) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
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
