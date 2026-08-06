import { NextResponse } from "next/server";
import { generateCreativeBrief, expandMoodBoardPrompt } from "@/lib/google/gemini";

/**
 * POST /api/gemini/brief
 * Body: { rawNotes: string, clientName: string, packageName: string }
 *
 * POST /api/gemini/moodboard
 * Body: { description: string }
 */
export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const action = url.searchParams.get("action") ?? "brief";
        const body = await req.json();

        if (action === "moodboard") {
            const result = await expandMoodBoardPrompt(body.description);
            return NextResponse.json({ success: true, result });
        }

        // Default: generate creative brief
        const { rawNotes, clientName, packageName } = body;
        if (!rawNotes || !clientName || !packageName) {
            return NextResponse.json(
                { success: false, error: "rawNotes, clientName, and packageName are required" },
                { status: 400 }
            );
        }

        const brief = await generateCreativeBrief(rawNotes, clientName, packageName);
        return NextResponse.json({ success: true, brief });
    } catch (error: any) {
        console.error("[Gemini API Route]", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
