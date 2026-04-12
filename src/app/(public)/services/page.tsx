"use client";

import Services from "@/components/public/Services";
import ProjectSlider from "@/components/public/ProjectSlider";
import ChooseUs from "@/components/public/ChooseUs";
import Processes from "@/components/public/Processes";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8 }
};

export default function ServicesPage() {
    return (
        <div className="pt-32">
            <motion.section
                {...fadeInUp}
                className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 lg:px-24 bg-gray-50 dark:bg-black py-20"
            >
                <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
                    How we serve you
                </span>
                <h1 className="font-display text-5xl md:text-7xl text-black dark:text-white mb-6 leading-[1.1]">
                    Design that Connects.<br />Strategy that Converts.
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
                    Whether you&apos;re building a startup brand or scaling an agency vision,
                    we craft bold identities, digital assets, and websites that actually <em>do the job</em>.
                    Looks that stick. Systems that scale.
                </p>
            </motion.section>

            <motion.div {...fadeInUp}>
                <Services />
            </motion.div>

            <motion.div {...fadeInUp}>
                <ProjectSlider />
            </motion.div>

            <motion.div {...fadeInUp}>
                <Processes />
            </motion.div>

            <motion.div {...fadeInUp}>
                <ChooseUs />
            </motion.div>

            <motion.section {...fadeInUp} className="bg-white dark:bg-lilBlack py-28 px-6 lg:px-24 border-t dark:border-gray-800 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-display text-5xl md:text-6xl text-black dark:text-white mb-8">
                        Let&apos;s Create Together!
                    </h1>
                    <p className="text-[18px] text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
                        At AndrewBrandr, we go beyond just design—we craft experiences
                        that inspire, connect, and elevate brands.
                    </p>

                    <Link
                        href="/work-with-me"
                        className="inline-block bg-orange text-white text-xl font-bold py-4 px-12 rounded-xl hover:bg-black transition-all"
                    >
                        Hire Me
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
