"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-10">
                    <Image
                        src="/images/ig-profile.png"
                        alt="AndrewBrandr"
                        width={40}
                        height={40}
                        className="rounded-full bg-black"
                    />
                    <h2 className="text-base tracking-tighter font-bold text-[var(--text-primary)]">
                        AndrewBrandr
                    </h2>
                </div>

                <h1 className="font-serif text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                    Welcome back
                </h1>
                <p className="text-[var(--text-secondary)] mb-8 text-sm">
                    Sign in to your Brand Studio
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black text-[var(--text-primary)] focus:outline-none focus:border-orange transition-colors text-sm"
                            placeholder="you@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black text-[var(--text-primary)] focus:outline-none focus:border-orange transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-lg font-bold text-white bg-orange hover:bg-orange-light disabled:opacity-60 transition-all text-sm"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-orange hover:text-orange-light transition-colors">
                        Create one
                    </Link>
                </p>

                <p className="mt-4 text-center">
                    <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-orange transition-colors">
                        ← Back to website
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
