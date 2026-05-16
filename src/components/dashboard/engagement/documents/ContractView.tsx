"use client";

import { motion } from "framer-motion";
import { FiShield, FiCheck, FiPenTool, FiDownload } from "react-icons/fi";

interface ContractViewProps {
    data: {
        title: string;
        clientName: string;
        date: string;
        terms: string[];
        status: "draft" | "sent" | "signed";
        signature?: { name: string; date: string; ip: string };
    };
    onSign?: (name: string) => void;
}

export default function ContractView({ data, onSign }: ContractViewProps) {
    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-[3rem] shadow-2xl text-black">
            {/* Header */}
            <div className="p-12 border-b border-gray-100 flex justify-between items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <FiShield className="text-orange" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Legal Service Agreement</span>
                    </div>
                    <h1 className="text-4xl font-display">{data.title}</h1>
                    <p className="text-sm font-medium text-gray-500">Between AndrewBrandr Studio and <u>{data.clientName}</u></p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Effective Date</p>
                    <p className="text-sm font-bold">{data.date}</p>
                </div>
            </div>

            {/* Terms Section */}
            <div className="p-12 space-y-12">
                <section className="space-y-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Standard Terms & Conditions</h3>
                    <div className="space-y-6">
                        {data.terms.map((term, i) => (
                            <div key={i} className="flex gap-6 pb-6 border-b border-gray-50">
                                <span className="text-xs font-bold text-orange mt-1">0{i + 1}</span>
                                <p className="text-sm leading-relaxed text-gray-600">{term}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Signature Section */}
                <section className="pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Studio Representative</p>
                            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                                <p className="font-display text-2xl italic mb-2">Andrew Brandr</p>
                                <div className="h-[1px] bg-gray-200 w-full mb-4" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed: {data.date}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client Signature</p>
                            {data.status === 'signed' ? (
                                <div className="p-8 rounded-2xl bg-green/5 border border-green/20">
                                    <p className="font-display text-2xl italic mb-2 text-green">{data.signature?.name}</p>
                                    <div className="h-[1px] bg-green/10 w-full mb-4" />
                                    <p className="text-[10px] font-bold text-green uppercase tracking-widest">
                                        Verified: {data.signature?.date} (IP: {data.signature?.ip})
                                    </p>
                                </div>
                            ) : (
                                <div className="p-8 rounded-2xl bg-orange/5 border border-dashed border-orange/20 flex flex-col items-center justify-center text-center">
                                    <FiPenTool className="text-orange mb-4" size={24} />
                                    <p className="text-xs font-bold text-orange uppercase tracking-widest mb-4">Awaiting Client Signature</p>
                                    <button 
                                        onClick={() => onSign?.(data.clientName)}
                                        className="px-8 py-3 bg-orange text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-orange/10"
                                    >
                                        Apply Digital Signature
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 rounded-b-[3rem] flex items-center justify-between">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Document Hash: #AB-2026-X99</p>
                 <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-orange uppercase tracking-widest transition-colors">
                    <FiDownload size={14} />
                    Export Document
                </button>
            </div>
        </div>
    );
}
