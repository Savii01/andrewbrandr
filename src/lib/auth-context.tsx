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
        // 1. Try Admin Bypass first via API
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Admin credentials confirmed — authenticate with Firebase Auth
                // so Firestore gets a real authenticated session
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                } catch (firebaseError: any) {
                    console.error("Firebase Auth sign in failed for admin:", firebaseError);

                    if (firebaseError?.code === 'auth/network-request-failed') {
                        throw new Error(
                            "Network connection error: Firebase servers are unreachable. " +
                            "If you are in a restricted network or your ISP blocks Firestore/Firebase, " +
                            "please connect to a VPN or switch internet connections to access the workspace."
                        );
                    }

                    // If user doesn't exist in Firebase Auth yet, try to create them
                    if (
                        firebaseError?.code === 'auth/user-not-found' ||
                        firebaseError?.code === 'auth/invalid-credential'
                    ) {
                        try {
                            await createUserWithEmailAndPassword(auth, email, password);
                        } catch (createError: any) {
                            console.error("Firebase Auth create user failed for admin:", createError);
                            
                            if (createError?.code === 'auth/email-already-in-use') {
                                throw new Error(
                                    "Firebase Authentication Mismatch: The email is already registered in Firebase, " +
                                    "but the password does not match the ADMIN_PASSWORD in your .env.local. " +
                                    "Please reset/change the password for " + email + " in your Firebase Console to " +
                                    "match the one in your .env.local (currently 'Savii123'), or update ADMIN_PASSWORD " +
                                    "in your .env.local to match your Firebase user password and restart the dev server."
                                );
                            }
                            
                            if (createError?.code === 'auth/network-request-failed') {
                                throw new Error(
                                    "Network connection error: Firebase servers are unreachable. " +
                                    "Please connect to a VPN or switch internet connections to access the workspace."
                                );
                            }

                            throw new Error(`Firebase Auth User Creation Failed: ${createError?.message || createError}`);
                        }
                    } else {
                        throw new Error(`Firebase Auth Sign In Failed: ${firebaseError?.message || firebaseError}`);
                    }
                }
                return;
            } else {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Invalid credentials. Please verify your admin access.");
            }
        } catch (e: any) {
            // If the error was thrown by our inner blocks, propagate it
            if (e instanceof Error && (
                e.message.includes("Firebase") || 
                e.message.includes("Network connection error") || 
                e.message.includes("Invalid credentials")
            )) {
                throw e;
            }
            console.error("Admin check failed, falling back to standard Firebase login:", e);
        }

        // 2. Fallback to standard Firebase login
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseError: any) {
            if (firebaseError?.code === 'auth/network-request-failed') {
                throw new Error(
                    "Network connection error: Firebase servers are unreachable. " +
                    "Please connect to a VPN or switch internet connections to access the workspace."
                );
            }
            throw firebaseError;
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
