"use client";

import React from "react";

const Terms = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-24 bg-gray-50 dark:bg-black">
            <div className="max-w-4xl mx-auto bg-white dark:bg-lilBlack p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h1 className="text-4xl md:text-5xl font-display text-black dark:text-white mb-4">Terms & Conditions</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10">Effective Date: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to <span className="text-orange font-bold">AndrewBrandr</span>. By accessing or using our website and design services, you agree to these Terms & Conditions. If you do not agree, please discontinue use immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. Services Offered</h2>
                        <p>
                            AndrewBrandr provides professional graphic design, branding, and web design services, including one-time projects and subscription-based packages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. Intellectual Property Rights</h2>
                        <p>
                            All designs, graphics, and content created by AndrewBrandr remain our intellectual property until full payment is made.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. Contact Information</h2>
                        <p>
                            For any questions regarding these Terms, please contact us at <a href="mailto:hello@andrewbrandr.com" className="text-orange hover:underline font-bold">hello@andrewbrandr.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
