import { NextResponse } from "next/server";
import { createClientFolder } from "@/lib/google/drive";

/**
 * POST /api/drive/create-folder
 * Body: {
 *   clientName: string,
 *   packageName: string,
 *   engagementId: string,
 * }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, packageName, engagementId } = body;

        if (!clientName || !packageName || !engagementId) {
            return NextResponse.json(
                { success: false, error: "clientName, packageName, and engagementId are required" },
                { status: 400 }
            );
        }

        const result = await createClientFolder({ clientName, packageName, engagementId });
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error("[Drive API Route]", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
