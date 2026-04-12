"use client";

import AboutMe from "@/components/public/AboutMe";
import Values from "@/components/public/Values";
import ChooseUs from "@/components/public/ChooseUs";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8 }
};

export default function AboutPage() {
    return (
        <div className="pt-32">
            <motion.div {...fadeInUp}>
                <AboutMe />
            </motion.div>

            <motion.div {...fadeInUp}>
                <Values />
            </motion.div>

            <motion.div {...fadeInUp}>
                <ChooseUs />
            </motion.div>

            <motion.section {...fadeInUp} className="bg-gray-50 dark:bg-lilBlack py-28 px-6 lg:px-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-display text-5xl md:text-6xl text-black dark:text-white mb-8">
                        Let&apos;s Create Together!
                    </h1>
                    <p className="text-[18px] text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
                        I am excited to collaborate with you on your next project. Whether you need a stunning website,
                        a captivating brand identity, or any other design service, I am here to bring your vision to life.
                        Let&apos;s work together to create something amazing that truly represents your brand and resonates with your audience.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/send-message"
                            className="bg-orange text-white text-xl font-bold py-4 px-10 rounded-xl hover:bg-black transition-all text-center"
                        >
                            Send A Message
                        </Link>
                        <Link
                            href="/projects"
                            className="bg-white dark:bg-black text-black dark:text-white border border-black dark:border-gray-700 text-xl font-bold py-4 px-10 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-center"
                        >
                            See Projects
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
