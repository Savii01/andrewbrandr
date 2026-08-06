import crypto from "crypto";

/**
 * Generates a Firebase Custom Token using Node's native `crypto` module.
 * Signs an RS256 JWT with the Service Account private key in .env.local.
 * ZERO external dependencies — 100% compatible with Vercel serverless functions.
 */
export function createFirebaseCustomToken(uid: string, claims: Record<string, any> = {}): string {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        const missing = [];
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

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    const signature = signer
        .sign(privateKey, "base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${unsignedToken}.${signature}`;
}
