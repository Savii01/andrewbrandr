import { NextResponse } from 'next/server';
import { createFirebaseCustomToken } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // 1. Verify credentials match .env
        if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Generate a Firebase custom token using native Node crypto — ZERO external dependencies,
        //    works 100% reliably on Vercel without ESM/bundling errors.
        const uid = `admin_${adminEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
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
