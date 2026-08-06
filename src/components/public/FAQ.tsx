"use client";

import React, { useState } from "react";
import { faqs } from "@/data"; // Import the FAQ data from our structured data file
import SendMessageForm from "./SendMessageForm";

/**
 * FAQ component matching the exact design fidelity of the original project.
 * Restored with two-column layout: FAQ list and SendMessageForm.
 */
const FAQ = ({ cmsData }: { cmsData?: any }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const activeBadge = cmsData?.badge || "FAQs";
  const activeHeading = cmsData?.heading || "Frequently Asked Questions";
  const activeDescription = cmsData?.description || "I know you might have questions, that are not in the FAQs.\n            You can send me a message here and I will get back to you as soon as possible. 😊";
  const activeFaqs = cmsData?.questions?.length > 0 ? cmsData.questions : faqs;

  return (
    <section className="py-16 px-6 bg-[#FDF3E6] dark:bg-black">
      <div className="text-center mb-10">
        <span className="bg-orange text-white px-3 py-2 mb-5 rounded-full text-xs uppercase tracking-wide font-medium">
          • {activeBadge}
        </span>
        <h1 className="text-black dark:text-white text-[24px] md:text-[36px] lg:text-[40px] font-customFont font-semibold tracking-tighter mb-6 leading-tight">
          {activeHeading}
        </h1>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* LEFT: FAQs (using 1/2 width to balance with form) */}
        <div className="lg:w-1/2">
          <div className="mt-8 space-y-4">
            {activeFaqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-lilBlack p-5 rounded-lg border border-[#0F0000]/10 dark:border-gray-800"
              >
                <button
                  className={`w-full flex justify-between items-center text-left text-lg font-medium text-gray-900 dark:text-white transition-all duration-300 ease-in-out ${openIndex === index ? "translate-y-1" : "translate-y-0"
                    }`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span
                    className={`text-orange text-[30px] transition-transform duration-300 ease-in-out ${openIndex === index ? "rotate-180 translate-y-1" : "rotate-0 translate-y-0"
                      }`}
                  >
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400 pr-5 lg:pr-20">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 bg-white/70 dark:bg-lilBlack/50 p-6 py-8 rounded-2xl border border-[#0F0000]/10 dark:border-gray-800">
          <h3 className="text-lg font-medium dark:text-white mb-16 whitespace-pre-line">
            {activeDescription}
          </h3>
          <SendMessageForm />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
