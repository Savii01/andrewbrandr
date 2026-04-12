import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // LOG RECEIVED DATA
        console.log("--- NEW ONBOARDING SUBMISSION ---");
        console.log("Package:", data.plan);
        console.log("Retainer Selected:", data.retainer);
        console.log("Brief Data:", data.brief);
        console.log("Lead Details:", data.lead);
        console.log("Payment Status:", data.paymentStatus || "N/A");
        console.log("---------------------------------");

        /**
         * FUTURE INTEGRATIONS:
         * 1. Add record to Database (Prisma/MongoDB/PostgreSQL)
         * 2. Send Telegram/WhatsApp notification to admin
         * 3. Add lead to CRM (HubSpot/Brevo)
         * 4. Trigger "Welcome" email to the customer
         */

        return NextResponse.json({
            success: true,
            message: "Onboarding data received successfully"
        });

    } catch (error) {
        console.error("Onboarding API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process onboarding" },
            { status: 500 }
        );
    }
}
