import { NextResponse } from 'next/server';
import { createFirebaseCustomToken } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if Vercel server environment is configured
        if (!adminEmail || !adminPassword) {
            const missing = [];
            if (!adminEmail) missing.push("ADMIN_EMAIL");
            if (!adminPassword) missing.push("ADMIN_PASSWORD");
            return NextResponse.json(
                { success: false, message: `Vercel configuration missing environment variables: ${missing.join(", ")}` },
                { status: 500 }
            );
        }

        // Verify credentials match .env
        const trimmedInputEmail = (email || '').trim().toLowerCase();
        const trimmedAdminEmail = adminEmail.trim().toLowerCase();
        const trimmedInputPassword = (password || '').trim();
        const trimmedAdminPassword = adminPassword.trim();

        if (trimmedInputEmail !== trimmedAdminEmail || trimmedInputPassword !== trimmedAdminPassword) {
            return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
        }

        // Generate custom token using native Node crypto
        const uid = `admin_${trimmedAdminEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const customToken = createFirebaseCustomToken(uid, { admin: true });

        return NextResponse.json({ success: true, customToken });
    } catch (error: any) {
        console.error('Admin auth error:', error);
        return NextResponse.json(
            { success: false, message: error?.message || 'Authentication service error. Please try again.' },
            { status: 500 }
        );
    }
}
