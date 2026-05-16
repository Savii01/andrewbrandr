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
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check for persistent Admin session first
        const adminSession = localStorage.getItem('admin_session');
        if (adminSession) {
            try {
                const session = JSON.parse(adminSession);
                setUser(session);
                setLoading(false);
            } catch (e) {
                localStorage.removeItem('admin_session');
            }
        }

        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Only overwrite if we don't have an admin session
            const hasAdmin = localStorage.getItem('admin_session');
            if (user || !hasAdmin) {
                setUser(user);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        // 1. Try Admin Bypass first via API
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const adminUser = { email, uid: 'admin-master' };
                setUser(adminUser as any);
                localStorage.setItem('admin_session', JSON.stringify(adminUser));
                return;
            }
        } catch (e) {
            console.error("Admin check failed, falling back to Firebase", e);
        }

        // 2. Fallback to standard Firebase login
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
        localStorage.removeItem('admin_session');
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
