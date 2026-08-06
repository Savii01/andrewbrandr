"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { FiMail, FiLock, FiChevronRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err?.message || "Invalid credentials. Please verify your admin access.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err: any) {
            setError("Google login failed. Ensure your email is authorized.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col md:flex-row selection:bg-[#CC3300] selection:text-white overflow-hidden">
            
            {/* LEFT COLUMN: Dark Panel with Saviour Portrait (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 bg-[#0c0000] relative overflow-hidden h-screen">
                {/* Full Height Saviour Andrew portrait */}
                <Image
                    src="/images/AboutMe.png"
                    alt="Saviour Andrew"
                    fill
                    className="object-cover grayscale pointer-events-none"
                    priority
                />
                {/* Overlay for legibility */}
                <div className="absolute inset-0 bg-black/35 z-0" />
                
                {/* Top Glassmorphic Logo & Status */}
                <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between bg-black/25 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl">
                    <Image
                        src="/brand_assets/secondary_logo_black_svg.svg"
                        alt="AndrewBrandr"
                        width={140}
                        height={35}
                        className="object-contain brightness-0 invert"
                    />
                    <div className="flex items-center gap-2 bg-white/15 border border-white/10 px-3.5 py-1.5 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-semibold text-white tracking-wide">Workspace secure</span>
                    </div>
                </div>

                {/* Bottom Glassmorphic Quote */}
                <div className="absolute bottom-8 left-8 right-8 z-10 bg-black/35 backdrop-blur-md border border-white/10 p-7 rounded-2xl shadow-xl">
                    <p className="text-base lg:text-lg font-bold text-white tracking-tight leading-snug">
                        "Branding is strategic communication. Timeless design is what translates that communication to growth."
                    </p>
                    <p className="text-xs font-semibold text-[#CC3300] tracking-wide mt-2.5">
                        Saviour Andrew — Director
                    </p>
                </div>
            </div>

            {/* RIGHT COLUMN: White Form Panel */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16 h-screen overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[380px] flex flex-col justify-center h-full min-h-[500px]"
                >
                    {/* Brand Identity Logo */}
                    <div className="mb-12">
                        <Image
                            src="/brand_assets/secondary_logo_black_svg.svg"
                            alt="AndrewBrandr"
                            width={200}
                            height={50}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="mb-8">
                        <span className="text-[#CC3300] text-xs font-semibold tracking-wider block mb-2">Master access</span>
                        <h1 className="text-3xl font-black text-[#0F0000] tracking-tight leading-none uppercase">
                            Welcome back
                        </h1>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 rounded-xl bg-[#CC3300]/5 border border-[#CC3300]/10 text-xs font-bold text-[#CC3300] text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CC3300] transition-colors">
                                <FiMail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-[#FDF3E6]/20 text-[#0F0000] focus:outline-none focus:border-[#CC3300] transition-all text-sm font-bold placeholder:text-gray-300"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CC3300] transition-colors">
                                <FiLock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-100 bg-[#FDF3E6]/20 text-[#0F0000] focus:outline-none focus:border-[#CC3300] transition-all text-sm font-bold placeholder:text-gray-300"
                                placeholder="Master password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC3300] transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group mt-4 bg-[#0F0000] text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#CC3300] transition-all shadow-xl shadow-[#0F0000]/10 disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Enter Workspace"}
                            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-gray-300">or</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border-2 border-gray-100 bg-white hover:bg-gray-50 text-[#0F0000] font-bold text-sm transition-all shadow-sm disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <Link href="/" className="text-xs font-semibold text-gray-400 hover:text-[#CC3300] transition-colors">
                            ← Exit to Website
                        </Link>
                        
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-gray-400">System active</span>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
