import { google } from "googleapis";

/**
 * Shared Google auth client using the service account.
 * Scopes cover Calendar (read/write + conferencing) and Drive (file management).
 */
export function getGoogleAuth() {
    return new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        scopes: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/drive",
        ],
    });
}

export function getCalendarClient() {
    return google.calendar({ version: "v3", auth: getGoogleAuth() });
}

export function getDriveClient() {
    return google.drive({ version: "v3", auth: getGoogleAuth() });
}
