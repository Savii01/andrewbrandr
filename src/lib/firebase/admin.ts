import crypto from "crypto";

function formatPrivateKey(rawKey: string): string {
    let key = rawKey.trim();

    // 1. Remove surrounding double or single quotes
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }

    // 2. Unescape escaped newlines \n -> real newline
    key = key.replace(/\\n/g, "\n");

    // 3. If header is present but no actual newlines exist (single line pasted), format correctly
    if (!key.includes("\n") && key.includes("-----BEGIN PRIVATE KEY-----")) {
        const body = key
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .trim();
        key = `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`;
    }

    return key.trim();
}

/**
 * Generates a Firebase Custom Token using Node's native `crypto` module.
 * Signs an RS256 JWT with the Service Account private key in .env.local.
 * ZERO external dependencies — 100% compatible with Vercel serverless functions.
 */
export function createFirebaseCustomToken(uid: string, claims: Record<string, any> = {}): string {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !rawPrivateKey) {
        const missing = [];
        if (!clientEmail) missing.push("GOOGLE_CLIENT_EMAIL");
        if (!rawPrivateKey) missing.push("GOOGLE_PRIVATE_KEY");
        throw new Error(`Server configuration missing environment variables on Vercel: ${missing.join(", ")}`);
    }

    const privateKey = formatPrivateKey(rawPrivateKey);

    const header = {
        alg: "RS256",
        typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: clientEmail,
        sub: clientEmail,
        aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
        iat: now,
        exp: now + 3600,
        uid: uid,
        claims: claims,
    };

    const base64UrlEncode = (obj: object) =>
        Buffer.from(JSON.stringify(obj))
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

    const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;

    try {
        const signer = crypto.createSign("RSA-SHA256");
        signer.update(unsignedToken);
        const signature = signer
            .sign(privateKey, "base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

        return `${unsignedToken}.${signature}`;
    } catch (err: any) {
        console.error("Crypto signing failed:", err);
        throw new Error(`Failed to sign authentication token: ${err?.message || "Invalid GOOGLE_PRIVATE_KEY format"}`);
    }
}
