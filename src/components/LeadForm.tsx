"use client";

import React from "react";

interface LeadFormProps {
    onUpdate: (data: any) => void;
    data: any;
    errors: any;
}

const LeadForm: React.FC<LeadFormProps> = ({ onUpdate, data, errors }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...data, [name]: value });
    };

    const setCurrency = (currency: "ngn" | "usd") => {
        onUpdate({ ...data, currency, whatsapp: "", telegram: "" });
    };

    const inputClasses = (field: string) => `w-full bg-white border rounded-xl px-4 py-3 text-black transition-all focus:ring-2 focus:ring-orange/20 outline-none text-base font-medium ${errors[field] ? "border-red-500" : "border-gray-200 focus:border-orange"
        }`;

    const labelClasses = "block text-[15px] font-bold text-black mb-2";

    const currency = data.currency || "ngn";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Currency Selection */}
            <div className="space-y-3">
                <label className={labelClasses}>How will you be paying? *</label>
                <p className="text-[13px] text-gray-400 font-medium -mt-2">This determines your payment options and how we stay in touch.</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrency("ngn")}
                        className={`py-4 px-4 rounded-xl border-2 text-sm font-bold transition-all text-left ${currency === "ngn" ? "bg-orange border-orange text-white" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}
                    >
                        <span className="block text-base mb-0.5">🇳🇬 Pay in Naira</span>
                        <span className={`text-[11px] font-medium ${currency === "ngn" ? "text-white/70" : "text-gray-400"}`}>Nigerian clients</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrency("usd")}
                        className={`py-4 px-4 rounded-xl border-2 text-sm font-bold transition-all text-left ${currency === "usd" ? "bg-orange border-orange text-white" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}
                    >
                        <span className="block text-base mb-0.5">🌍 Pay in USD</span>
                        <span className={`text-[11px] font-medium ${currency === "usd" ? "text-white/70" : "text-gray-400"}`}>International clients</span>
                    </button>
                </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Full Name *</label>
                    <input name="fullName" value={data.fullName || ""} onChange={handleChange} className={inputClasses("fullName")} placeholder="First & Last Name" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label className={labelClasses}>Email Address *</label>
                    <input type="email" name="email" value={data.email || ""} onChange={handleChange} className={inputClasses("email")} placeholder="name@company.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Communication channel — split by currency */}
            {currency === "ngn" ? (
                <div>
                    <label className={labelClasses}>WhatsApp Number *</label>
                    <p className="text-[13px] text-gray-400 font-medium -mt-1 mb-2">We'll confirm payment and keep you updated here.</p>
                    <input
                        name="whatsapp"
                        value={data.whatsapp || ""}
                        onChange={handleChange}
                        className={inputClasses("whatsapp")}
                        placeholder="e.g. 2348012345678 (with country code, no +)"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                </div>
            ) : (
                <div>
                    <label className={labelClasses}>Telegram Username *</label>
                    <p className="text-[13px] text-gray-400 font-medium -mt-1 mb-2">We'll coordinate your project over Telegram. No phone number needed.</p>
                    <input
                        name="telegram"
                        value={data.telegram || ""}
                        onChange={handleChange}
                        className={inputClasses("telegram")}
                        placeholder="e.g. @yourusername"
                    />
                    {errors.telegram && <p className="text-red-500 text-xs mt-1">{errors.telegram}</p>}
                </div>
            )}

            {/* How did you hear */}
            <div>
                <label className={labelClasses}>How did you hear about us? *</label>
                <select name="source" value={data.source || ""} onChange={handleChange} className={inputClasses("source")}>
                    <option value="">Select an option</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Google">Google</option>
                    <option value="Other">Other</option>
                </select>
                {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
            </div>
        </div>
    );
};

export default LeadForm;
