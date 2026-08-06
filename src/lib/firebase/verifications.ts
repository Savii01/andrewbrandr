import { db } from "@/lib/firebase/config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

// EmailJS — create a template named "template_verify" with variables:
// to_email, client_name, verify_code, verify_link
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const VERIFY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_VERIFY_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export type VerificationTarget = "brief" | "engagement";

export interface VerificationDoc {
    targetType: VerificationTarget | "email";
    targetId: string;
    email: string;
    code: string;
    expiresAt: number; // epoch ms
    verified: boolean;
    createdAt: number;
}

export const generateVerificationCode = () =>
    String(Math.floor(100000 + Math.random() * 900000));

/** Doc id for one-click verification targeted at a brief or engagement. */
export const targetVerificationDocId = (type: VerificationTarget, id: string) => `${type}_${id}`;

/** Deterministic doc id scoped to an email, used for inline (pre-submit) verification. */
export const emailVerificationDocId = (email: string) => {
    const key = email.trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
    }
    return `email_${Math.abs(hash).toString(36)}`;
};

const siteOrigin = () =>
    typeof window !== "undefined" ? window.location.origin : "";

export const buildVerifyLink = (docId: string, code: string) =>
    `${siteOrigin()}/verify-email?docId=${encodeURIComponent(docId)}&code=${code}`;

async function persistVerification(
    id: string,
    data: Omit<VerificationDoc, "verified" | "createdAt">
) {
    const ref = doc(db, "verifications", id);
    await setDoc(ref, { ...data, verified: false, createdAt: Date.now() } as VerificationDoc);
}

async function sendVerifyEmail(toEmail: string, clientName: string, code: string, verifyLink: string) {
    return emailjs.send(
        EMAILJS_SERVICE_ID,
        VERIFY_TEMPLATE_ID,
        {
            to_email: toEmail,
            client_name: clientName || "there",
            verify_code: code,
            verify_link: verifyLink,
        },
        EMAILJS_PUBLIC_KEY
    );
}

/**
 * Sends a 6-digit code for inline verification (email-scoped, before the
 * brief exists). Returns the doc id so the form can validate the code.
 */
export async function sendEmailVerificationCode(email: string, clientName?: string) {
    const docId = emailVerificationDocId(email);
    const code = generateVerificationCode();
    await persistVerification(docId, {
        targetType: "email",
        targetId: email,
        email,
        code,
        expiresAt: Date.now() + CODE_TTL_MS,
    });
    await sendVerifyEmail(email, clientName || "", code, buildVerifyLink(docId, code));
    return { docId, code };
}

/** Validates an inline code; marks the verification record verified on success. */
export async function checkEmailVerificationCode(email: string, code: string) {
    const docId = emailVerificationDocId(email);
    const snap = await getDoc(doc(db, "verifications", docId));
    if (!snap.exists()) return false;
    const data = snap.data() as VerificationDoc;
    if (data.code !== code) return false;
    if (Date.now() > data.expiresAt) return false;
    await updateDoc(doc(db, "verifications", docId), { verified: true });
    return true;
}

/**
 * Sends a one-click verification email for a brief or engagement and stores
 * the code so the /verify-email page can confirm it.
 */
export async function sendTargetVerificationEmail(opts: {
    targetType: VerificationTarget;
    targetId: string;
    email: string;
    clientName?: string;
}) {
    const { targetType, targetId, email, clientName } = opts;
    const docId = targetVerificationDocId(targetType, targetId);
    const code = generateVerificationCode();
    await persistVerification(docId, {
        targetType,
        targetId,
        email,
        code,
        expiresAt: Date.now() + CODE_TTL_MS,
    });
    await sendVerifyEmail(email, clientName || "", code, buildVerifyLink(docId, code));
    return { docId, code };
}

export async function getVerification(docId: string) {
    const snap = await getDoc(doc(db, "verifications", docId));
    return snap.exists() ? (snap.data() as VerificationDoc) : null;
}
