"use client";

import { motion } from "framer-motion";

export default function PortfolioAdminPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-1">
                    Portfolio
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Manage your public portfolio and case studies
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-lil-black p-12 text-center"
            >
                <p className="text-[var(--text-muted)] text-sm mb-4">Portfolio engine coming soon</p>
                <p className="text-xs text-[var(--text-muted)]">
                    Toggle projects public/private, auto-generate case studies, and sync with your website.
                </p>
            </motion.div>
        </div>
    );
}
