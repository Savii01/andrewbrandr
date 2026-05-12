"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaTelegram, FaCreditCard, FaUniversity } from "react-icons/fa";
import { MdArrowForward, MdUploadFile, MdClose } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

const ENV = {
    opay: { number: process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER || "—", name: process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NAME || "—" },
    moniepoint: { number: process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NUMBER || "—", name: process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NAME || "—" },
    grey: {
        account: process.env.NEXT_PUBLIC_GREY_ACCOUNT_NUMBER || "—",
        ach: process.env.NEXT_PUBLIC_GREY_ACH_ROUTING || "—",
        wire: process.env.NEXT_PUBLIC_GREY_WIRE_ROUTING || "—",
        bank: process.env.NEXT_PUBLIC_GREY_BANK_NAME || "—",
    },
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "",
};

function BankCard({ logo, name, account, accountName }: { logo: React.ReactNode; name: string; account: string; accountName: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{name}</span>
                {logo}
            </div>
            <p className="text-xl font-bold text-black tracking-wider mb-1">{account}</p>
            <p className="text-sm text-gray-500 font-medium mb-3">{accountName}</p>
            <button
                onClick={copy}
                className="text-xs font-bold text-orange hover:text-black transition-colors flex items-center gap-1"
            >
                {copied ? <><FiCheck className="text-green-500" /> Copied!</> : "Copy account number"}
            </button>
        </div>
    );
}

function ComingSoonModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-black transition-colors">
                    <MdClose size={22} />
                </button>
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-5">
                    <FaCreditCard className="text-orange" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-black tracking-tighter mb-3">Coming Soon</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Card payment is currently being set up. In the meantime, please use the bank transfer option below — it's quick and reliable.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-orange transition-colors"
                >
                    Got it, I'll transfer
                </button>
            </div>
        </div>
    );
}

interface PaymentStepProps {
    currency: "ngn" | "usd";
    totalNGN: number;
    totalUSD?: string;
    plan: any;
    isRetainerSelected: boolean;
    onSubmit: (receiptFile: File | null, method: string) => void;
    isSubmitting: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    currency, totalNGN, plan, isRetainerSelected, onSubmit, isSubmitting
}) => {
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [method, setMethod] = useState<string>("");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setReceiptFile(e.target.files[0]);
    };

    if (currency === "ngn") {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Order summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                        <span>{plan.title}</span>
                        <span className="text-black font-bold">{plan.priceNGN}</span>
                    </div>
                    {isRetainerSelected && (
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                            <span>Monthly retainer</span>
                            <span className="text-black font-bold">{plan.retainer.priceNGN}/mo</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                        <span className="text-black">Total due today</span>
                        <span className="text-orange text-lg">₦{totalNGN.toLocaleString()}</span>
                    </div>
                </div>

                {/* Bank accounts */}
                <div>
                    <h4 className="text-[15px] font-bold text-black mb-4">Transfer payment to</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <BankCard logo={<span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded-full">OPAY</span>} name="OPay" account={ENV.opay.number} accountName={ENV.opay.name} />
                        <BankCard logo={<span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">MPT</span>} name="Moniepoint" account={ENV.moniepoint.number} accountName={ENV.moniepoint.name} />
                    </div>
                </div>

                <p className="text-[13px] text-gray-400 leading-relaxed bg-orange/5 border border-orange/10 rounded-xl p-4">
                    Transfer the exact amount to either account above. After transferring, upload your receipt below and we'll confirm your payment within a few hours.
                </p>

                {/* Receipt upload */}
                <div>
                    <label className="block text-[15px] font-bold text-black mb-2">Upload payment receipt</label>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-orange transition-colors text-center bg-gray-50 hover:bg-orange/5">
                        <MdUploadFile size={28} className="text-gray-300" />
                        <span className="text-sm font-medium text-gray-400">
                            {receiptFile ? receiptFile.name : "Click to upload (JPG, PNG, PDF)"}
                        </span>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} className="hidden" />
                    </label>
                </div>

                {/* WhatsApp alternative */}
                {ENV.whatsapp && (
                    <a href={`https://wa.me/${ENV.whatsapp}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[14px] font-bold text-green-600 hover:text-green-700 transition-colors">
                        <FaWhatsapp size={18} />
                        Or send your receipt directly on WhatsApp
                    </a>
                )}

                {/* Submit */}
                <button
                    onClick={() => onSubmit(receiptFile, "bank-ngn")}
                    disabled={isSubmitting}
                    className="group w-full inline-flex items-center justify-between gap-4 bg-[#0F140F] text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-orange disabled:opacity-50 text-sm"
                >
                    {isSubmitting ? "Submitting..." : "I have made payment"}
                    <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    // USD flow
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}

            {/* USD Order summary */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>{plan.title}</span>
                    <span className="text-black font-bold">{plan.priceUSD}</span>
                </div>
                {isRetainerSelected && (
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                        <span>Monthly retainer</span>
                        <span className="text-black font-bold">{plan.retainer.priceUSD}/mo</span>
                    </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                    <span className="text-black">Total due today</span>
                    <span className="text-orange text-lg">{plan.priceUSD}</span>
                </div>
            </div>

            {/* Payment options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card — Coming Soon */}
                <button
                    onClick={() => setShowComingSoon(true)}
                    className="bg-black text-white rounded-2xl p-6 flex flex-col gap-2 hover:bg-[#1a1a1a] transition-colors text-left group"
                >
                    <FaCreditCard className="text-orange" size={22} />
                    <span className="font-bold text-base">Pay by card</span>
                    <span className="text-[11px] text-white/40 font-medium leading-snug">Instant · Visa & Mastercard</span>
                    <span className="text-[10px] bg-orange/20 text-orange px-2 py-0.5 rounded-full font-bold w-fit mt-1">Coming soon</span>
                </button>

                {/* Bank transfer */}
                <button
                    onClick={() => setMethod("bank-usd")}
                    className={`rounded-2xl p-6 flex flex-col gap-2 transition-colors text-left border-2 ${method === "bank-usd" ? "border-orange bg-orange/5" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                >
                    <FaUniversity className={method === "bank-usd" ? "text-orange" : "text-gray-400"} size={22} />
                    <span className="font-bold text-base text-black">Bank transfer</span>
                    <span className="text-[11px] text-gray-400 font-medium leading-snug">ACH · 1–2 days &nbsp;|&nbsp; Wire · 1 day</span>
                </button>
            </div>

            {/* Grey bank details */}
            {method === "bank-usd" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-[15px] font-bold text-black">Wire transfer to</h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3 text-sm">
                        <Row label="Bank name" value={ENV.grey.bank} />
                        <Row label="Account number" value={ENV.grey.account} copyable />
                        <Row label="ACH routing" value={ENV.grey.ach} copyable />
                        <Row label="Wire routing" value={ENV.grey.wire} copyable />
                        <Row label="Account type" value="Checking" />
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed bg-orange/5 border border-orange/10 rounded-xl p-4">
                        Use your full name as the payment reference. After sending, upload your transfer confirmation below — we'll confirm within 24 hours.
                    </p>
                </div>
            )}

            {/* Receipt upload */}
            <div>
                <label className="block text-[15px] font-bold text-black mb-2">Upload transfer confirmation</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-orange transition-colors text-center bg-gray-50 hover:bg-orange/5">
                    <MdUploadFile size={28} className="text-gray-300" />
                    <span className="text-sm font-medium text-gray-400">
                        {receiptFile ? receiptFile.name : "Click to upload (JPG, PNG, PDF)"}
                    </span>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} className="hidden" />
                </label>
            </div>

            {/* Telegram alternative */}
            {ENV.telegram && (
                <a href={`https://t.me/${ENV.telegram}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[14px] font-bold text-blue-500 hover:text-blue-600 transition-colors">
                    <FaTelegram size={18} />
                    Prefer to confirm via Telegram? @{ENV.telegram}
                </a>
            )}

            {/* Submit */}
            <button
                onClick={() => onSubmit(receiptFile, method || "bank-usd")}
                disabled={isSubmitting}
                className="group w-full inline-flex items-center justify-between gap-4 bg-[#0F140F] text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-orange disabled:opacity-50 text-sm"
            >
                {isSubmitting ? "Submitting..." : "I have sent payment"}
                <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

function Row({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-400">{label}</span>
            <span className="font-bold text-black flex items-center gap-2">
                {value}
                {copyable && (
                    <button onClick={copy} className="text-[10px] text-orange hover:text-black transition-colors font-bold">
                        {copied ? "✓" : "Copy"}
                    </button>
                )}
            </span>
        </div>
    );
}

export default PaymentStep;
