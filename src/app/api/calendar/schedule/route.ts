import { NextResponse } from "next/server";
import { scheduleConsultation } from "@/lib/google/calendar";

/**
 * POST /api/calendar/schedule
 * Body: {
 *   clientName: string,
 *   clientEmail?: string,   // optional — invite skipped when missing
 *   dateTime: string,      // ISO 8601
 *   packageName?: string,
 *   notes?: string,
 *   durationMinutes?: number,
 * }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, clientEmail, dateTime, packageName, notes, durationMinutes } = body;

        if (!clientName || !dateTime) {
            return NextResponse.json(
                { success: false, error: "clientName and dateTime are required" },
                { status: 400 }
            );
        }

        const result = await scheduleConsultation({
            clientName,
            clientEmail,
            dateTime,
            packageName,
            notes,
            durationMinutes,
        });

        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error("[Calendar API Route]", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
