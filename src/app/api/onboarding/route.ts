import { NextResponse } from "next/server";
import { scheduleConsultation } from "@/lib/google/calendar";
import { createClientFolder } from "@/lib/google/drive";
import { generateCreativeBrief } from "@/lib/google/gemini";

/**
 * POST /api/onboarding
 *
 * Expected body:
 * {
 *   plan: string,
 *   retainer: boolean,
 *   paymentStatus?: string,
 *   lead: {
 *     name: string,
 *     email: string,
 *     businessName?: string,
 *     phone?: string,
 *   },
 *   brief: {
 *     rawNotes?: string,
 *     consultationDate?: string, // ISO 8601 — if provided, schedules a meeting
 *   },
 *   engagementId: string,
 * }
 */
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { plan, retainer, paymentStatus, lead, brief, engagementId } = data;

        const clientName = lead?.name ?? "New Client";
        const clientEmail = lead?.email ?? "";
        const packageName = retainer ? `${plan} (Retainer)` : plan;
        const rawNotes = brief?.rawNotes ?? "";
        const consultationDate = brief?.consultationDate ?? null;

        console.log("─── NEW ONBOARDING SUBMISSION ───");
        console.log("Package:", packageName);
        console.log("Client:", clientName, clientEmail);
        console.log("Payment:", paymentStatus ?? "N/A");
        console.log("─────────────────────────────────");

        // ── Run all three integrations in parallel ──────────────
        const results = await Promise.allSettled([
            // 1. Gemini — parse intake notes into a creative brief
            rawNotes
                ? generateCreativeBrief(rawNotes, clientName, packageName)
                : Promise.resolve(null),

            // 2. Google Calendar + Meet — only if a date was provided
            consultationDate && clientEmail
                ? scheduleConsultation({
                      clientName,
                      clientEmail,
                      dateTime: consultationDate,
                      packageName,
                      notes: rawNotes,
                  })
                : Promise.resolve(null),

            // 3. Google Drive — always create client folder
            createClientFolder({
                clientName,
                packageName,
                engagementId: engagementId ?? `eng-${Date.now()}`,
            }),
        ]);

        // ── Extract results safely ────────────────────────────────
        const briefData =
            results[0].status === "fulfilled" ? results[0].value : null;
        const meetingData =
            results[1].status === "fulfilled" ? results[1].value : null;
        const driveData =
            results[2].status === "fulfilled" ? results[2].value : null;

        // Log any integration failures without crashing the response
        if (results[0].status === "rejected")
            console.error("[Gemini] Failed:", results[0].reason);
        if (results[1].status === "rejected")
            console.error("[Calendar] Failed:", results[1].reason);
        if (results[2].status === "rejected")
            console.error("[Drive] Failed:", results[2].reason);

        return NextResponse.json({
            success: true,
            message: "Onboarding processed successfully",
            integrations: {
                brief: briefData,
                meeting: meetingData,
                drive: driveData,
            },
        });
    } catch (error) {
        console.error("Onboarding API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process onboarding" },
            { status: 500 }
        );
    }
}
