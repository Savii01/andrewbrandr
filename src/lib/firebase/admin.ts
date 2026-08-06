import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { Auth } from "firebase-admin/auth";

/**
 * Firebase Admin SDK singleton.
 * Uses the same service account already in .env.local
 * (GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY) — no extra JSON file needed.
 */
function getAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }

    return initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            // Stored with literal \n — replace with real newlines
            privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export function getAdminAuth(): Auth {
    getAdminApp();
    return getAuth();
}
