import { getCalendarClient } from "./auth";

export interface ScheduleConsultationParams {
    clientName: string;
    /** Optional — invite is skipped when no email is available */
    clientEmail?: string;
    /** ISO 8601 string e.g. "2026-08-15T14:00:00Z" */
    dateTime: string;
    packageName?: string;
    notes?: string;
    /** Duration in minutes, defaults to 60 */
    durationMinutes?: number;
}

export interface ConsultationResult {
    eventId: string;
    meetLink: string | null;
    eventLink: string | null;
    startTime: string;
    endTime: string;
}

/**
 * Creates a 1-hour Google Calendar consultation event and auto-attaches
 * a Google Meet link via conferenceData.
 */
export async function scheduleConsultation(
    params: ScheduleConsultationParams
): Promise<ConsultationResult> {
    const { clientName, clientEmail, dateTime, packageName = "Design Consultation", notes, durationMinutes = 60 } = params;

    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID!;

    const startTime = new Date(dateTime).toISOString();
    const endTime = new Date(new Date(dateTime).getTime() + durationMinutes * 60 * 1000).toISOString();

    const event = {
        summary: `${packageName}: ${clientName}`,
        description: notes
            ? `Client Notes:\n${notes}`
            : `Initial discovery and brand alignment session with ${clientName}.`,
        start: { dateTime: startTime, timeZone: "UTC" },
        end: { dateTime: endTime, timeZone: "UTC" },
        attendees: clientEmail ? [{ email: clientEmail }] : undefined,
        conferenceData: {
            createRequest: {
                requestId: `brandr-meet-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
            },
        },
    };

    const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all", // sends invite email to client
    });

    const meetLink =
        response.data.conferenceData?.entryPoints?.find(
            (ep) => ep.entryPointType === "video"
        )?.uri ?? null;

    return {
        eventId: response.data.id!,
        meetLink,
        eventLink: response.data.htmlLink ?? null,
        startTime,
        endTime,
    };
}
