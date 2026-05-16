"use client";

import { motion } from "framer-motion";
import { FiFileText, FiCheck, FiDownload, FiExternalLink } from "react-icons/fi";

interface ProposalViewProps {
    data: {
        title: string;
        description: string;
        scope: string[];
        investment: { label: string; amount: number }[];
        status: "pending" | "approved" | "rejected";
    };
    isAdmin?: boolean;
    onApprove?: () => void;
}

export default function ProposalView({ data, isAdmin, onApprove }: ProposalViewProps) {
    return (
        <div className="max-w-4xl mx-auto bg-[var(--surface)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Document Header */}
            <div className="p-12 bg-black text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FiFileText className="text-orange" size={24} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange">Strategic Proposal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display leading-tight">{data.title}</h1>
                        <p className="text-white/60 max-w-xl leading-relaxed">{data.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                             data.status === 'approved' ? 'bg-green/10 border-green text-green' : 
                             data.status === 'rejected' ? 'bg-red-500/10 border-red-500 text-red-500' :
                             'bg-orange/10 border-orange text-orange'
                         }`}>
                             {data.status}
                         </span>
                    </div>
                </div>
            </div>

            <div className="p-12 space-y-16">
                {/* Scope Section */}
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-orange" />
                        Scope of Engagement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.scope.map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)]">
                                <div className="mt-1 w-5 h-5 rounded-full bg-orange/10 flex items-center justify-center text-orange shrink-0">
                                    <FiCheck size={12} />
                                </div>
                                <span className="text-sm font-medium text-[var(--text-primary)]">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Investment Section */}
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-orange" />
                        Strategic Investment
                    </h3>
                    <div className="space-y-4">
                        {data.investment.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-[var(--border-color)]">
                                <span className="font-bold text-[var(--text-primary)]">{item.label}</span>
                                <span className="text-xl font-display text-orange">₦{item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="mt-8 p-8 rounded-3xl bg-black text-white flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Total Investment</p>
                                <p className="text-3xl font-display">
                                    ₦{data.investment.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                                </p>
                            </div>
                            {!isAdmin && data.status === 'pending' && (
                                <button 
                                    onClick={onApprove}
                                    className="px-10 py-4 bg-orange text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-xl shadow-orange/20"
                                >
                                    Approve & Sign
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Actions Footer */}
                <div className="pt-12 border-t border-[var(--border-color)] flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        AndrewBrandr Studio &copy; 2026
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] hover:text-orange uppercase tracking-widest transition-colors">
                            <FiDownload size={14} />
                            Download PDF
                        </button>
                        <div className="w-[1px] h-4 bg-[var(--border-color)]" />
                        <button className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] hover:text-orange uppercase tracking-widest transition-colors">
                            <FiExternalLink size={14} />
                            Share Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
