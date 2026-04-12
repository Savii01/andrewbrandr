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

    const inputClasses = (field: string) => `w-full bg-white border rounded-xl px-4 py-3 text-black transition-all focus:ring-2 focus:ring-orange/20 outline-none text-base font-medium ${errors[field] ? "border-red-500" : "border-gray-200 focus:border-orange"
        }`;

    const labelClasses = "block text-[15px] font-bold text-black mb-2";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <div>
                <label className={labelClasses}>Phone Number (with country code)</label>
                <input name="phone" value={data.phone || ""} onChange={handleChange} className={inputClasses("phone")} placeholder="+234 ..." />
            </div>

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
