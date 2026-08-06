import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // 1. Verify the credentials match .env
        if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Generate a Firebase custom token — Admin SDK vouches for this user,
        //    so the Firebase Auth user's password is completely irrelevant.
        const adminAuth = getAdminAuth();
        const uid = `admin_${adminEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const customToken = await adminAuth.createCustomToken(uid, { admin: true });

        return NextResponse.json({ success: true, customToken });
    } catch (error: any) {
        console.error('Admin auth error:', error);
        return NextResponse.json(
            { success: false, message: 'Authentication service error. Please try again.' },
            { status: 500 }
        );
    }
}
