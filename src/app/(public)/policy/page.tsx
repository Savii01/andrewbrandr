"use client";

import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-24 bg-gray-50 dark:bg-black">
            <div className="max-w-4xl mx-auto bg-white dark:bg-lilBlack p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h1 className="text-4xl md:text-5xl font-display text-black dark:text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10">
                    Effective Date: {new Date().toLocaleDateString()}
                </p>

                <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. Introduction</h2>
                        <p>
                            At <span className="text-orange font-bold">AndrewBrandr</span>, we respect
                            your privacy and are committed to protecting your personal
                            information. This Privacy Policy outlines how we collect, use, and
                            protect your information when you use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. Information We Collect</h2>
                        <p>
                            We collect information that you provide when you visit our
                            website, engage with our services, or contact us. This may include
                            your name, email address, phone number, and other details necessary
                            to deliver our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. Data Security</h2>
                        <p>
                            We take reasonable security measures to protect your personal data
                            from unauthorized access, loss, or misuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. Contact Us</h2>
                        <p>
                            If you have any questions regarding this policy, you can contact us at:
                        </p>
                        <p className="mt-4">
                            <strong>Email:</strong>{" "}
                            <a href="mailto:hello@andrewbrandr.com" className="text-orange hover:underline font-bold">
                                hello@andrewbrandr.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
