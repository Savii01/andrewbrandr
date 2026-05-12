"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { FiMail, FiLock, FiChevronRight } from "react-icons/fi";

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
            setError("Invalid credentials. Please verify your admin access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#0F0000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Brand Identity */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Image
                            src="/brand_assets/primary_logo_black.png"
                            alt="AndrewBrandr"
                            width={180}
                            height={45}
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                    <h1 className="text-[32px] font-customFont font-bold text-[#0F0000] tracking-tighter mb-3">
                        Studio Command
                    </h1>
                    <p className="text-[#0F0000]/50 text-[15px] font-medium max-w-[280px]">
                        Sign in to manage active engagements and studio operations.
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 rounded-2xl bg-[#CC3300]/5 border border-[#CC3300]/10 text-[#CC3300] text-sm font-bold flex items-center justify-center text-center"
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
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-white text-[#0F0000] focus:outline-none focus:border-[#CC3300] transition-all text-sm font-bold placeholder:text-gray-300"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CC3300] transition-colors">
                            <FiLock size={18} />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-white text-[#0F0000] focus:outline-none focus:border-[#CC3300] transition-all text-sm font-bold placeholder:text-gray-300"
                            placeholder="Master password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group mt-4 bg-[#0F0000] text-white py-4 px-6 rounded-2xl font-bold text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#CC3300] transition-all shadow-xl shadow-[#0F0000]/10 disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER STUDIO"}
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-6">
                    <Link href="/" className="text-xs font-black text-gray-400 hover:text-[#CC3300] tracking-[0.2em] uppercase transition-colors">
                        ← Exit to Website
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Systems Online</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

