import { NextResponse } from "next/server";
import { generateCreativeBrief } from "@/lib/google/gemini";
import { scheduleConsultation } from "@/lib/google/calendar";

/**
 * POST /api/discovery
 * Body: {
 *   clientName: string,
 *   clientEmail?: string,
 *   packageName?: string,
 *   rawNotes?: string,     // client intake notes for Gemini
 *   dateTime: string,      // ISO 8601 — fixed time for the first discovery call
 *   durationMinutes?: number,
 * }
 *
 * Runs Gemini to structure the creative brief AND creates a Google Calendar
 * event with a Google Meet link for the first discovery call.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, clientEmail, packageName = "Branding", rawNotes, dateTime, durationMinutes } = body;

        if (!clientName || !dateTime) {
            return NextResponse.json(
                { success: false, error: "clientName and dateTime are required" },
                { status: 400 }
            );
        }

        const [briefResult, meetingResult] = await Promise.allSettled([
            rawNotes
                ? generateCreativeBrief(rawNotes, clientName, packageName)
                : Promise.resolve(null),
            clientEmail
                ? scheduleConsultation({
                      clientName,
                      clientEmail,
                      dateTime,
                      packageName,
                      notes: rawNotes || "Discovery & strategy kickoff with Saviour Andrew (Brandr Studio).",
                      durationMinutes,
                  })
                : Promise.resolve(null),
        ]);

        if (briefResult.status === "rejected")
            console.error("[Discovery API] Gemini brief failed:", briefResult.reason);
        if (meetingResult.status === "rejected")
            console.error("[Discovery API] Meet scheduling failed:", meetingResult.reason);

        return NextResponse.json({
            success: true,
            brief: briefResult.status === "fulfilled" ? briefResult.value : null,
            meeting: meetingResult.status === "fulfilled" ? meetingResult.value : null,
        });
    } catch (error: any) {
        console.error("[Discovery API]", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
