"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithCustomToken,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    signInWithGoogle: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clear any stale legacy admin sessions if present to prevent unauthenticated bypass
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_session');
        }

        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        // Step 1: Verify admin credentials against .env via the API
        let customToken: string | null = null;
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                customToken = data.customToken ?? null;
            } else {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Invalid credentials. Please verify your admin access.");
            }
        } catch (e: any) {
            // Propagate explicit auth errors to the UI
            throw e;
        }

        // Step 2a: If we got a custom token, sign in with it — password mismatch is impossible
        if (customToken) {
            try {
                await signInWithCustomToken(auth, customToken);
                return;
            } catch (err: any) {
                if (err?.code === 'auth/network-request-failed') {
                    throw new Error(
                        "Network error: Firebase servers are unreachable. " +
                        "Please check your internet connection or try a VPN."
                    );
                }
                throw new Error("Authentication failed. Please try again.");
            }
        }

        // Step 2b: Fallback — standard Firebase email/password login (non-admin users)
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseError: any) {
            if (firebaseError?.code === 'auth/network-request-failed') {
                throw new Error(
                    "Network error: Firebase servers are unreachable. " +
                    "Please check your internet connection or try a VPN."
                );
            }
            throw new Error("Invalid credentials. Please check your email and password.");
        }
    };

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signOut = async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_session');
        }
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
