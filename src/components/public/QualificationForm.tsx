"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheck, MdArrowForward, MdArrowBack } from "react-icons/md";

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "chips" | "checkboxes" | "date";
  options?: string[];
  placeholder?: string;
  description?: string;
}

interface QualificationFormProps {
  stage: string;
  slug: string;
  onSubmit: (data: any) => void;
}

const basicFields: FormField[] = [
  { id: "name", label: "Full Name", type: "text" },
  { id: "email", label: "Email Address", type: "email" },
  { id: "country", label: "Country of Residence or Business Location", type: "text", placeholder: "e.g. Nigeria, United Kingdom" },
  { id: "comm_pref", label: "Preferred Communication Channel", type: "select", options: ["Email", "WhatsApp", "Telegram"] }
];

const stageSpecificData: Record<string, { title: string; intro: string; fields: FormField[] }> = {
  foundation: {
    title: "Stage 01 Context",
    intro: "Now, let's look at your brand's foundation.",
    fields: [
      { id: "business", label: "Business Name", type: "text" },
      { id: "selling", label: "What do you sell?", type: "select", options: ["Product", "Service", "Both"] },
      { id: "description", label: "Describe your business in 2–3 sentences.", type: "textarea" },
      { id: "target", label: "Who is your target customer? (Age, Location, Type)", type: "text" },
      { 
        id: "vibe", 
        label: "How do you want your brand to feel? (Select up to 3)", 
        type: "chips", 
        options: ["Bold", "Minimal", "Premium", "Professional", "Friendly", "Playful", "Trustworthy", "Modern", "Traditional"] 
      },
      { 
        id: "timeline", 
        label: "What timeline are you working with?", 
        type: "select", 
        options: ["Within the next 4 weeks", "1–2 months", "2–3 months", "Flexible / Exploring"],
        description: "Stage 01 is typically delivered within 2–3 weeks once approved."
      }
    ]
  },
  clarity: {
    title: "Stage 02 Context",
    intro: "Help us understand where your brand currently stands.",
    fields: [
      { id: "business", label: "Business Name", type: "text" },
      { id: "operating", label: "How long have you been operating?", type: "select", options: ["Less than 1 year", "1–2 years", "2–3 years", "3+ years"] },
      { id: "inconsistency", label: "What currently feels inconsistent about your brand?", type: "textarea" },
      { id: "feedback", label: "What do customers currently say about your business?", type: "textarea" },
      { id: "platforms", label: "Where does your brand currently show up?", type: "checkboxes", options: ["Instagram", "LinkedIn", "Website", "Print", "Packaging", "Other"] },
      { id: "goals", label: "What needs to change in the next 6 months?", type: "textarea" },
      { 
        id: "timeline", 
        label: "What timeline are you working with?", 
        type: "select", 
        options: ["Within the next 6 weeks", "1–3 months", "3–6 months", "Flexible / Exploring"],
        description: "Stage 02 is typically delivered within 4–6 weeks once aligned."
      }
    ]
  },
  scale: {
    title: "Stage 03 Context",
    intro: "Share the context behind your expansion.",
    fields: [
      { id: "business", label: "Business Name", type: "text" },
      { id: "driver", label: "What is driving this scale?", type: "select", options: ["Entering new markets", "Launching new products", "Repositioning", "Investor preparation", "Other"] },
      { id: "requirements", label: "Which of these are required?", type: "checkboxes", options: ["Packaging", "Website redesign", "Full rebrand", "Internal design system"] },
      { id: "markets", label: "What markets are you entering?", type: "textarea" },
      { id: "growth_needs", label: "What needs to change for the brand to match this growth?", type: "textarea" },
      { 
        id: "timeline", 
        label: "What timeline are you working with?", 
        type: "select", 
        options: ["Within the next 2 months", "2–4 months", "4–6 months", "Flexible / Exploring"],
        description: "Stage 03 is typically delivered within 6–10 weeks based on scope."
      }
    ]
  },
  enterprise: {
    title: "Enterprise Context",
    intro: "Provide context about your organisation.",
    fields: [
      { id: "org", label: "Organisation Name", type: "text" },
      { id: "role", label: "Your Role in the Organisation", type: "text" },
      { id: "size", label: "Team Size", type: "select", options: ["10–50", "50–200", "200+"] },
      { id: "trigger", label: "What prompted this rebrand or system rebuild?", type: "textarea" },
      { id: "stakeholders", label: "How many stakeholders will be involved?", type: "select", options: ["1–3", "4–10", "10+"] },
      { id: "outcome", label: "What is the intended outcome of this engagement?", type: "textarea" },
      { 
        id: "timeline", 
        label: "What timeline are you working with?", 
        type: "select", 
        options: ["Within the next 3 months", "3–6 months", "6–12 months", "Flexible / Strategic Planning"],
        description: "Enterprise engagements are scoped individually based on organisational needs."
      }
    ]
  }
};

export default function QualificationForm({ slug, stage, onSubmit }: QualificationFormProps) {
  const [step, setStep] = useState(1);
  const stageData = stageSpecificData[slug] || stageSpecificData.foundation;
  const [formDataState, setFormDataState] = useState<Record<string, any>>({});
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit({ ...formDataState, vibe: selectedChips, platforms: selectedChecks });
    }
  };

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else if (selectedChips.length < 3) {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const toggleCheck = (check: string) => {
    if (selectedChecks.includes(check)) {
      setSelectedChecks(selectedChecks.filter(c => c !== check));
    } else {
      setSelectedChecks([...selectedChecks, check]);
    }
  };

  const currentFields = step === 1 ? basicFields : stageData.fields;

  return (
    <div className="py-10">
      <div className="bg-white rounded-[3rem] p-8 md:p-16 border-6 border-[#0F0000] shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FDF3E6]">
          <motion.div 
            className="h-full bg-[#CC3300]"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <span className="text-[#CC3300] font-black  text-lg">
             {stage} Qualification
          </span>
          <span className="text-[14px] font-black text-[#0F0000]/40">
            0{step} / 02
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-[32px] md:text-[42px] font-black text-[#0F0000] leading-tight mb-4 tracking-tight">
              {step === 1 ? "Basic Details" : stageData.title}
            </h1>
            <p className="text-[#0F0000]/60 text-lg font-medium mb-12 max-w-[540px] leading-relaxed">
              {step === 1 
                ? "Before we schedule your discovery call, please answer a few questions about your business and goals." 
                : stageData.intro}
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              {currentFields.map((field) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[18px] font-extrabold text-[#0F0000]">
                      {field.label}
                    </label>
                    {field.description && (
                      <p className="text-[18px] font-medium text-[#CC3300]/80 italic">
                        {field.description}
                      </p>
                    )}
                  </div>

                  {field.type === "text" && (
                    <input
                      required
                      type="text"
                      placeholder={field.placeholder}
                      value={formDataState[field.id] || ""}
                      className="w-full bg-[#FDF3E6] border-2 border-[#0F0000] rounded-2xl px-6 py-4 text-[#0F0000] font-bold outline-none focus:ring-2 focus:ring-[#CC3300] transition-all"
                      onChange={(e) => setFormDataState({ ...formDataState, [field.id]: e.target.value })}
                    />
                  )}

                  {field.type === "email" && (
                    <input
                      required
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={formDataState[field.id] || ""}
                      className="w-full bg-[#FDF3E6] border-2 border-[#0F0000] rounded-2xl px-6 py-4 text-[#0F0000] font-bold outline-none focus:ring-2 focus:ring-[#CC3300] transition-all"
                      onChange={(e) => setFormDataState({ ...formDataState, [field.id]: e.target.value })}
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      required
                      rows={4}
                      value={formDataState[field.id] || ""}
                      className="w-full bg-[#FDF3E6] border-2 border-[#0F0000] rounded-2xl px-6 py-4 text-[#0F0000] font-bold outline-none focus:ring-2 focus:ring-[#CC3300] transition-all resize-none"
                      onChange={(e) => setFormDataState({ ...formDataState, [field.id]: e.target.value })}
                    />
                  )}

                  {field.type === "select" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {field.options?.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormDataState({ ...formDataState, [field.id]: opt })}
                          className={`px-6 py-4 rounded-xl border-2 font-bold transition-all text-left ${
                            formDataState[field.id] === opt 
                            ? "bg-[#0F0000] border-[#0F0000] text-white" 
                            : "bg-[#FDF3E6] border-[#0F0000] text-[#0F0000]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === "chips" && (
                    <div className="flex flex-wrap gap-2">
                      {field.options?.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleChip(opt)}
                          className={`px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all ${
                            selectedChips.includes(opt) 
                            ? "bg-[#CC3300] border-[#CC3300] text-white" 
                            : "bg-[#FDF3E6] border-[#0F0000] text-[#0F0000]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === "checkboxes" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {field.options?.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleCheck(opt)}
                          className={`px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-between ${
                            selectedChecks.includes(opt) 
                            ? "bg-[#0F0000] border-[#0F0000] text-white" 
                            : "bg-[#FDF3E6] border-[#0F0000] text-[#0F0000]"
                          }`}
                        >
                          {opt}
                          {selectedChecks.includes(opt) && <MdCheck size={16} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#0F0000] text-[#0F0000] px-10 py-6 rounded-full text-lg font-bold hover:bg-[#FDF3E6] transition-colors"
                  >
                    <MdArrowBack className="w-5 h-5" />
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] inline-flex items-center justify-center gap-2 bg-[#CC3300] text-white px-10 py-6 rounded-full text-lg font-bold hover:bg-[#0f0000] transition-colors shadow-xl group"
                >
                  {step === 1 ? "Next: Stage Context" : "Submit Application"}
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
