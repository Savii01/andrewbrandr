"use client";

import { motion } from "framer-motion";

export default function CommunicationsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-1">
                    Communications
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Unified inbox across email, Telegram, Discord, and WhatsApp
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-12 text-center"
            >
                <p className="text-[var(--text-muted)] text-sm mb-4">Communication hub coming soon</p>
                <p className="text-xs text-[var(--text-muted)]">
                    Email, Telegram, Discord, and WhatsApp integrations will be set up here.
                </p>
            </motion.div>
        </div>
    );
}
