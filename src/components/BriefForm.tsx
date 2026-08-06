"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";

interface BriefFormProps {
    plan: string;
    onUpdate: (data: any) => void;
    data: any;
    errors: any;
}

const BriefForm: React.FC<BriefFormProps> = ({ plan, onUpdate, data, errors }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            onUpdate({ ...data, [name]: checked });
        } else {
            onUpdate({ ...data, [name]: value });
        }
    };

    const handleChipSelect = (field: string, option: string) => {
        const current = data[field] || [];
        let updated;
        if (current.includes(option)) {
            updated = current.filter((i: string) => i !== option);
        } else {
            updated = [...current, option];
            if (updated.length > 3) { // Back to 3 as requested
                updated.shift();
            }
        }
        onUpdate({ ...data, [field]: updated });
    };

    const handleCheckboxGroup = (field: string, option: string) => {
        const current = data[field] || [];
        let updated;
        if (current.includes(option)) {
            updated = current.filter((i: string) => i !== option);
        } else {
            updated = [...current, option];
        }
        onUpdate({ ...data, [field]: updated });
    };

    const renderError = (field: string) => {
        if (errors[field]) {
            return <p className="text-red-500 text-xs mt-1 font-medium">{errors[field]}</p>;
        }
        return null;
    };

    const inputClasses = (field: string) => `w-full bg-white border rounded-xl px-4 py-3 text-black transition-all focus:ring-2 focus:ring-orange/10 outline-none text-base font-medium ${errors[field] ? "border-red-500" : "border-gray-200 focus:border-orange"
        }`;

    const labelClasses = "block text-[16px] font-bold text-black mb-0.5";
    const subLabelClasses = "block text-[13px] font-medium text-gray-400 mb-3 tracking-tight leading-relaxed";

    // --- RENDERERS BY STAGE ---

    if (plan === "foundation") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                    <label className={labelClasses}>Business Name *</label>
                    <span className={subLabelClasses}>What should we call you?</span>
                    <input name="businessName" value={data.businessName || ""} onChange={handleChange} placeholder="Business name" className={inputClasses("businessName")} />
                    {renderError("businessName")}
                </div>

                <div className="space-y-4 pt-2">
                    <label className={labelClasses}>Who is your customer? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className={subLabelClasses}>Age Range</span>
                            <input name="customerAge" value={data.customerAge || ""} onChange={handleChange} placeholder="e.g., 25-45" className={inputClasses("customerAge")} />
                            {renderError("customerAge")}
                        </div>
                        <div className="space-y-1">
                            <span className={subLabelClasses}>Location</span>
                            <input name="customerLocation" value={data.customerLocation || ""} onChange={handleChange} placeholder="e.g., Lagos, Global" className={inputClasses("customerLocation")} />
                            {renderError("customerLocation")}
                        </div>
                        <div className="space-y-1">
                            <span className={subLabelClasses}>Gender</span>
                            <select name="customerGender" value={data.customerGender || ""} onChange={handleChange} className={inputClasses("customerGender")}>
                                <option value="">--Select--</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="both">Both/All</option>
                                <option value="other">Other</option>
                            </select>
                            {renderError("customerGender")}
                        </div>
                        <div className="space-y-1">
                            <span className={subLabelClasses}>Type of Person</span>
                            <input name="customerType" value={data.customerType || ""} onChange={handleChange} placeholder="e.g., Tech Founders" className={inputClasses("customerType")} />
                            {renderError("customerType")}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className={labelClasses}>What do you sell? *</label>
                    <div className="flex gap-3">
                        {["Product", "Service", "Both"].map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onUpdate({ ...data, sellType: opt })}
                                className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${data.sellType === opt ? "bg-orange border-orange text-white" : "border-gray-50 bg-gray-50 text-gray-400"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    {renderError("sellType")}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Proposed Goal</label>
                    <span className={subLabelClasses}>What is the main goal you want this brand to achieve?</span>
                    <textarea
                        name="proposedGoal"
                        value={data.proposedGoal || ""}
                        onChange={handleChange}
                        rows={3}
                        className={inputClasses("proposedGoal")}
                        placeholder="e.g., Break into the Nigerian market and double online sales within 6 months..."
                    ></textarea>
                    {renderError("proposedGoal")}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Describe your business in two sentences *</label>
                    <textarea
                        name="description"
                        value={data.description || ""}
                        onChange={handleChange}
                        rows={3}
                        className={inputClasses("description")}
                        placeholder="Real estate agency focused on affordable luxury..."
                    ></textarea>
                    {renderError("description")}
                </div>



                <div className="space-y-3">
                    <label className={labelClasses}>How do you want your brand to feel? (Select up to 3) *</label>
                    <div className="flex flex-wrap gap-2">
                        {["Bold", "Minimal", "Luxurious", "Friendly", "Professional", "Playful", "Premium", "Trustworthy", "Modern", "Traditional"].map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => handleChipSelect("brandFeel", opt)}
                                className={`px-4 py-2 rounded-full text-[11px] font-bold border-2 transition-all ${data.brandFeel?.includes(opt)
                                    ? "bg-orange border-orange text-white"
                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    {renderError("brandFeel")}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Industry *</label>
                    <span className={subLabelClasses}>Which industry best describes your product/service?</span>
                    <select name="industry" value={data.industry || ""} onChange={handleChange} className={inputClasses("industry")}>
                        <option value="">--Select--</option>
                        <option value="tech">Technology</option>
                        <option value="fashion">Fashion & Lifestyle</option>
                        <option value="food">Food & Beverage</option>
                        <option value="realestate">Real Estate</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                    </select>
                    {renderError("industry")}
                </div>

                {data.industry === "other" && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelClasses}>Please specify your industry *</label>
                        <input
                            name="otherIndustry"
                            value={data.otherIndustry || ""}
                            onChange={handleChange}
                            placeholder="Enter your industry"
                            className={inputClasses("otherIndustry")}
                        />
                        {renderError("otherIndustry")}
                    </div>
                )}
            </div>
        );
    }

    if (plan === "clarity") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                    <label className={labelClasses}>Business Name *</label>
                    <input name="businessName" value={data.businessName || ""} onChange={handleChange} className={inputClasses("businessName")} required />
                    {renderError("businessName")}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>How long have you been operating? *</label>
                    <select name="duration" value={data.duration || ""} onChange={handleChange} className={inputClasses("duration")}>
                        <option value="">Select duration</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1–2 years">1–2 years</option>
                        <option value="2–3 years">2–3 years</option>
                    </select>
                    {renderError("duration")}
                </div>

                <div className="space-y-3">
                    <label className={labelClasses}>Upload your current logo *</label>
                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center hover:border-orange transition-colors cursor-pointer group bg-gray-50/50">
                        <input type="file" name="logo" onChange={(e) => onUpdate({ ...data, logoFile: e.target.files?.[0]?.name })} className="hidden" id="logo-upload" accept=".jpg,.png,.svg,.pdf" />
                        <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                            <FaIcons.FaCloudUploadAlt size={32} className="text-gray-300 group-hover:text-orange transition-colors mb-2" />
                            <span className="text-gray-400 text-sm font-bold">Upload assets</span>
                        </label>
                    </div>
                    {data.logoFile && <p className="text-xs text-orange mt-2 font-bold flex items-center gap-1"><FaIcons.FaFile className="inline" /> {data.logoFile}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className={labelClasses}>Current Customers *</label>
                        <textarea name="currentCustomers" value={data.currentCustomers || ""} onChange={handleChange} rows={4} className={inputClasses("currentCustomers")} placeholder="Who buys from you now?"></textarea>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Ideal Customers *</label>
                        <textarea name="idealCustomers" value={data.idealCustomers || ""} onChange={handleChange} rows={4} className={inputClasses("idealCustomers")} placeholder="Who do you want to attract?"></textarea>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className={labelClasses}>Brand Platforms *</label>
                    <div className="flex flex-wrap gap-4">
                        {["Instagram", "LinkedIn", "Website", "Print", "Packaging", "WhatsApp"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={data.platforms?.includes(opt)} onChange={() => handleCheckboxGroup("platforms", opt)} className="hidden" />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${data.platforms?.includes(opt) ? "bg-orange border-orange" : "border-gray-200 group-hover:border-gray-300"}`}>
                                    {data.platforms?.includes(opt) && <FaIcons.FaCheck size={10} className="text-white" />}
                                </div>
                                <span className="text-[13px] font-bold text-gray-500">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (plan === "scale") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                    <label className={labelClasses}>Business Name *</label>
                    <input name="businessName" value={data.businessName || ""} onChange={handleChange} className={inputClasses("businessName")} />
                    {renderError("businessName")}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Expansion Strategy *</label>
                    <textarea name="newMarkets" value={data.newMarkets || ""} onChange={handleChange} rows={3} className={inputClasses("newMarkets")} placeholder="New markets or regions?"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className={labelClasses}>Packaging Scope</label>
                        <div className="flex gap-3">
                            {["Yes", "No"].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => onUpdate({ ...data, needPackaging: opt })}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${data.needPackaging === opt ? "bg-orange border-orange text-white" : "border-gray-50 bg-gray-50 text-gray-400"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className={labelClasses}>Digital Scope</label>
                        <div className="flex gap-3">
                            {["Yes", "No"].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => onUpdate({ ...data, needWebsite: opt })}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${data.needWebsite === opt ? "bg-orange border-orange text-white" : "border-gray-50 bg-gray-50 text-gray-400"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Launch Date *</label>
                    <input type="date" name="launchDate" value={data.launchDate || ""} onChange={handleChange} className={inputClasses("launchDate")} />
                </div>
            </div>
        );
    }

    if (plan === "enterprise") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                    <label className={labelClasses}>Organisation Name *</label>
                    <input name="businessName" value={data.businessName || ""} onChange={handleChange} className={inputClasses("businessName")} />
                    {renderError("businessName")}
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>Proposed Goal</label>
                    <span className={subLabelClasses}>What is the main goal you want this project to achieve?</span>
                    <textarea
                        name="proposedGoal"
                        value={data.proposedGoal || ""}
                        onChange={handleChange}
                        rows={3}
                        className={inputClasses("proposedGoal")}
                        placeholder="e.g., Rebrand the organisation ahead of our new product launch in Q3..."
                    ></textarea>
                    {renderError("proposedGoal")}
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>Project Scope *</label>
                    <textarea name="description" value={data.description || ""} onChange={handleChange} rows={5} className={inputClasses("description")} placeholder="Describe what you need in 3–5 sentences..."></textarea>
                    {renderError("description")}
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>Team Size *</label>
                    <select name="teamSize" value={data.teamSize || ""} onChange={handleChange} className={inputClasses("teamSize")}>
                        <option value="">Select size</option>
                        <option value="10–50">10–50</option>
                        <option value="51–200">51–200</option>
                        <option value="200+">200+ people</option>
                    </select>
                </div>
            </div>
        );
    }

    return null;
};

export default BriefForm;
