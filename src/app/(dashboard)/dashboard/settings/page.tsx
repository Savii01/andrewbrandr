"use client";

import { motion } from "framer-motion";
import { useThemeContext } from "@/lib/context/ThemeContext";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export default function SettingsPage() {
    const { theme, setTheme } = useThemeContext();

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl md:text-4xl text-(--text-primary) mb-1">
                    Settings
                </h1>
                <p className="text-sm text-(--text-secondary)">
                    Configure your Brand Studio
                </p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-6"
                >
                    <h2 className="text-sm font-semibold text-(--text-primary) mb-4">
                        Appearance
                    </h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setTheme("light")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${theme === "light"
                                ? "border-orange bg-orange/10 text-orange"
                                : "border-gray-200 dark:border-gray-800 text-(--text-secondary) hover:border-orange/50"
                                }`}
                        >
                            <FiSun size={16} />
                            Light
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${theme === "dark"
                                ? "border-orange bg-orange/10 text-orange"
                                : "border-gray-200 dark:border-gray-800 text-(--text-secondary) hover:border-orange/50"
                                }`}
                        >
                            <FiMoon size={16} />
                            Dark
                        </button>
                        <button
                            onClick={() => setTheme("system")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${theme === "system"
                                ? "border-orange bg-orange/10 text-orange"
                                : "border-gray-200 dark:border-gray-800 text-(--text-secondary) hover:border-orange/50"
                                }`}
                        >
                            <FiMonitor size={16} />
                            System
                        </button>
                    </div>
                </motion.div>

                {/* Firebase Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-6"
                >
                    <h2 className="text-sm font-semibold text-(--text-primary) mb-2">
                        Integrations
                    </h2>
                    <p className="text-xs text-(--text-muted)">
                        Firebase, Paystack, email, and messaging integrations will be configured here.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
