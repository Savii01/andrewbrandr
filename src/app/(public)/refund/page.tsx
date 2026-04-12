"use client";

import React from "react";
import Button from "@/components/public/Button";
import { MdArrowOutward } from "react-icons/md";

const Refund = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-24 bg-gray-50 dark:bg-black flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white dark:bg-lilBlack p-12 text-center rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
                <h1 className="text-5xl font-display text-black dark:text-white mb-6">Refund Policy</h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
                    I believe in the quality of my work, but I understand that things don&apos;t always go as planned.
                    My refund policy is designed to be fair to both of us.
                </p>

                <div className="text-left space-y-6 mb-10 w-full">
                    <div className="bg-gray-50 dark:bg-black p-6 rounded-2xl border dark:border-gray-800">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">Standalone Projects</h3>
                        <p className="text-gray-600 dark:text-gray-400">Refunds can be requested within 7 days of project kick-off if no significant work has been delivered.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-black p-6 rounded-2xl border dark:border-gray-800">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">Ongoing Support</h3>
                        <p className="text-gray-600 dark:text-gray-400">Subscriptions can be paused or canceled at any time. We do not provide prorated refunds.</p>
                    </div>
                </div>

                <Button
                    href="/send-message"
                    label="Contact Support"
                    variant="orange"
                    icon={MdArrowOutward}
                />
            </div>
        </div>
    );
};

export default Refund;
