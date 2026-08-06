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

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        const missing = [];
        if (!projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
        if (!clientEmail) missing.push("GOOGLE_CLIENT_EMAIL");
        if (!privateKey) missing.push("GOOGLE_PRIVATE_KEY");
        throw new Error(`Server configuration missing environment variables: ${missing.join(", ")}`);
    }

    // Clean up private key: remove surrounding quotes if present, replace escaped \n with real newlines
    privateKey = privateKey.trim();
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    return initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

export function getAdminAuth(): Auth {
    getAdminApp();
    return getAuth();
}
