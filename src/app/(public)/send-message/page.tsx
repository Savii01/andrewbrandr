"use client";

import SendMessageForm from "@/components/public/SendMessageForm";

export default function SendMessagePage() {
    return (
        <div className="bg-white dark:bg-black px-6 lg:px-32 py-20 mt-20 min-h-screen">
            <h1 className="text-center text-5xl font-display mb-10 dark:text-white">
                Send a Message
            </h1>
            <div className="max-w-3xl mx-auto">
                <h3 className="text-lg text-center font-medium dark:text-white mb-16 leading-relaxed text-pretty">
                    I know you might have questions that are not in the FAQs.
                    You can send me a message here and I will get back to you as soon as possible. 😊
                </h3>
                <SendMessageForm />
            </div>
        </div>
    );
}
