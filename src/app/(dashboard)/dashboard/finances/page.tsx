"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiDollarSign, FiArrowUpRight, FiDownload,
    FiCheckCircle, FiClock, FiPlus, FiFileText,
    FiAlertCircle, FiSend, FiX, FiEye, FiCheck, FiTrash2
} from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { useActiveEngagements, useStudioStats } from "@/lib/hooks/useDashboardData";
import { getAllInvoices, markInvoicePaid, deleteInvoice } from "@/lib/firebase/invoices";
import { Invoice } from "@/lib/types/dashboard";
import InvoiceCreatorModal from "@/components/dashboard/InvoiceCreatorModal";
import InvoicePreviewModal from "@/components/dashboard/InvoicePreviewModal";
import { getTierDefaultPrice } from "@/lib/constants/tierConfig";

export default function FinancesPage() {
    const { engagements, loading: engagementsLoading } = useActiveEngagements();
    const { stats, loading: statsLoading } = useStudioStats();

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);
    const [showCreator, setShowCreator] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
    const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

    const loadInvoices = async () => {
        setInvoicesLoading(true);
        try {
            const data = await getAllInvoices();
            setInvoices(data);
        } catch (e) {
            console.error("Failed to load invoices:", e);
        } finally {
            setInvoicesLoading(false);
        }
    };

    useEffect(() => { loadInvoices(); }, []);

    // ── Derive recent transactions from engagements ──
    const getTierAmount = (tier: any) => {
        return getTierDefaultPrice(tier);
    };

    const recentTransactions: any[] = [];
    engagements.forEach(eng => {
        const isOnce = eng.paymentStructure === "once";
        const totalAmount = eng.customPrice !== undefined && eng.customPrice !== null
            ? eng.customPrice : getTierAmount(eng.tier);
        const dateStr = eng.createdAt
            ? (eng.createdAt as any).toDate().toLocaleDateString()
            : new Date().toLocaleDateString();

        if (isOnce) {
            recentTransactions.push({
                id: `${eng.id}-full`, client: eng.projectName,
                type: "Full Upfront Payment",
                amount: `₦${totalAmount.toLocaleString()}`,
                date: dateStr,
                status: eng.depositPaid ? "paid" : "pending"
            });
        } else {
            recentTransactions.push({
                id: `${eng.id}-deposit`, client: eng.projectName,
                type: "Upfront Deposit (50%)",
                amount: `₦${(totalAmount * 0.5).toLocaleString()}`,
                date: dateStr,
                status: eng.depositPaid ? "paid" : "pending"
            });
            if (eng.depositPaid) {
                recentTransactions.push({
                    id: `${eng.id}-final`, client: eng.projectName,
                    type: "Final Balance (50%)",
                    amount: `₦${(totalAmount * 0.5).toLocaleString()}`,
                    date: dateStr,
                    status: eng.finalPaid ? "paid" : "pending"
                });
            }
        }
    });

    // ── Invoice helpers ──
    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        draft: { label: "Draft", color: "bg-[var(--text-muted)]/10 text-[var(--text-muted)]", icon: <FiFileText size={11} /> },
        sent: { label: "Sent", color: "bg-blue-500/10 text-blue-500", icon: <FiSend size={11} /> },
        paid: { label: "Paid", color: "bg-green/10 text-green", icon: <FiCheckCircle size={11} /> },
        overdue: { label: "Overdue", color: "bg-red-500/10 text-red-500", icon: <FiAlertCircle size={11} /> },
        cancelled: { label: "Cancelled", color: "bg-[var(--text-muted)]/10 text-[var(--text-muted)] line-through", icon: <FiX size={11} /> },
    };

    const handleMarkPaid = async (id: string) => {
        const ref = prompt("Enter payment reference (optional):");
        await markInvoicePaid(id, ref || undefined);
        loadInvoices();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this invoice? This cannot be undone.")) return;
        await deleteInvoice(id);
        loadInvoices();
    };

    const fmtInvoiceAmount = (inv: Invoice) => {
        const sym = inv.currency === "ngn" ? "₦" : "$";
        const total = inv.amount ?? inv.lineItems?.reduce((s, l) => s + l.qty * l.rate, 0) ?? 0;
        return `${sym}${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* ── Header ── */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-display text-[24px] md:text-[36px] lg:text-[40px] text-[var(--text-primary)] mb-2">
                        Finances
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Track incoming payments, retainers, and studio revenue.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-bold rounded-xl hover:border-orange hover:text-orange transition-all">
                        <FiDownload size={15} /> Export CSV
                    </button>
                    <button
                        onClick={() => setShowCreator(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-orange/20">
                        <FiPlus size={15} /> New Invoice
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)]">
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-secondary)]">
                        <div className="p-2 bg-[var(--surface-elevated)] rounded-lg"><FiDollarSign size={18} /></div>
                        <span className="text-sm font-bold">Total MRR</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-[var(--surface-elevated)] rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
                                ₦{stats.monthlyRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs font-bold text-green flex items-center gap-1">
                                <FiArrowUpRight /> +12.5% from last month
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)]">
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-secondary)]">
                        <div className="p-2 bg-[var(--surface-elevated)] rounded-lg"><FiClock size={18} /></div>
                        <span className="text-sm font-bold">Pending Payments</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-[var(--surface-elevated)] rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
                                {stats.unpaidInvoicesCount}
                            </p>
                            <p className="text-xs font-bold text-orange flex items-center gap-1">
                                ₦{stats.unpaidAmount.toLocaleString()} awaiting clearance
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl border border-orange/30 bg-orange text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg"><FiDollarSign size={18} /></div>
                        <span className="text-sm font-bold">Projected Run Rate</span>
                    </div>
                    {statsLoading ? (
                        <div className="h-10 bg-white/20 rounded animate-pulse w-1/2" />
                    ) : (
                        <div>
                            <p className="text-3xl font-display font-bold mb-2">
                                ₦{(stats.monthlyRevenue * 12).toLocaleString()}
                            </p>
                            <p className="text-xs font-medium text-white/80">Estimated Annual Recurring Revenue</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Invoice List ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden mb-8">
                <div className="p-6 lg:p-8 border-b border-[var(--border-color)] flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-display text-[var(--text-primary)]">Invoices</h2>
                        <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{invoices.length} total</p>
                    </div>
                    <button onClick={() => setShowCreator(true)}
                        className="flex items-center gap-2 text-sm font-bold text-orange hover:text-orange/70 transition-colors">
                        <FiPlus size={14} /> Create Invoice
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--surface-elevated)]/50 border-b border-[var(--border-color)]">
                                {["Invoice #", "Client", "Amount", "Due Date", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/50">
                            {invoicesLoading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-[var(--surface-elevated)] rounded animate-pulse w-3/4" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : invoices.length > 0 ? (
                                invoices.map(inv => {
                                    const sc = statusConfig[inv.status] ?? statusConfig.draft;
                                    return (
                                        <tr key={inv.id} className="hover:bg-[var(--surface-elevated)]/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-[var(--text-primary)]">{inv.invoiceNumber || "—"}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm text-[var(--text-primary)]">{inv.clientName || "—"}</div>
                                                <div className="text-xs text-[var(--text-muted)]">{inv.clientEmail || ""}</div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-sm text-[var(--text-primary)]">
                                                {fmtInvoiceAmount(inv)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium">
                                                {inv.dueDate || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${sc.color}`}>
                                                    {sc.icon} {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Preview / Download */}
                                                    <button
                                                        onClick={() => setPreviewInvoice(inv)}
                                                        title="Preview & Download"
                                                        className="p-2 rounded-xl bg-orange/5 hover:bg-orange text-orange hover:text-white transition-all duration-200 border border-orange/10 flex items-center justify-center"
                                                    >
                                                        <FiEye size={14} />
                                                    </button>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => setEditInvoice(inv)}
                                                        title="Edit Invoice"
                                                        className="p-2 rounded-xl bg-white/5 hover:bg-white text-[var(--text-secondary)] hover:text-black border border-white/5 transition-all duration-200 flex items-center justify-center"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    {inv.status !== "paid" && inv.status !== "cancelled" && (
                                                        <button 
                                                            onClick={() => handleMarkPaid(inv.id)}
                                                            title="Mark Paid"
                                                            className="p-2 rounded-xl bg-green/5 hover:bg-green text-green hover:text-white border border-green/10 transition-all duration-200 flex items-center justify-center"
                                                        >
                                                            <FiCheck size={14} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(inv.id)}
                                                        title="Delete"
                                                        className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500 text-[var(--text-muted)] hover:text-white border border-red-500/10 transition-all duration-200 flex items-center justify-center"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-muted)]">
                                                <FiFileText size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-[var(--text-muted)]">No invoices yet</p>
                                            <button onClick={() => setShowCreator(true)}
                                                className="text-sm font-bold text-orange hover:text-orange/70 transition-colors">
                                                Create your first invoice →
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* ── Transactions Table ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h2 className="text-xl font-display text-[var(--text-primary)]">Engagement Payments</h2>
                    <button className="text-sm font-bold text-orange hover:text-orange/70 transition-colors">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--surface-elevated)]/50 border-b border-[var(--border-color)]">
                                <th className="px-6 lg:px-8 py-4 text-xs font-bold text-[var(--text-muted)]">Client / Project</th>
                                <th className="px-6 lg:px-8 py-4 text-xs font-bold text-[var(--text-muted)]">Date</th>
                                <th className="px-6 lg:px-8 py-4 text-xs font-bold text-[var(--text-muted)]">Amount</th>
                                <th className="px-6 lg:px-8 py-4 text-xs font-bold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/50">
                            {engagementsLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(4)].map((_, j) => (
                                            <td key={j} className="px-6 lg:px-8 py-4">
                                                <div className="h-4 bg-[var(--surface-elevated)] rounded animate-pulse w-3/4" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : recentTransactions.length > 0 ? (
                                recentTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                                        <td className="px-6 lg:px-8 py-4">
                                            <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{tx.client}</div>
                                            <div className="text-xs font-bold text-[var(--text-muted)]">{tx.type}</div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 text-sm text-[var(--text-secondary)] font-medium">{tx.date}</td>
                                        <td className="px-6 lg:px-8 py-4 text-sm font-bold text-[var(--text-primary)]">{tx.amount}</td>
                                        <td className="px-6 lg:px-8 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tx.status === "paid" ? "bg-green/10 text-green" : "bg-orange/10 text-orange"}`}>
                                                {tx.status === "paid" ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* ── Invoice Creator Modal (New) ── */}
            <InvoiceCreatorModal
                isOpen={showCreator}
                onClose={() => setShowCreator(false)}
                onCreated={() => {
                    setShowCreator(false);
                    loadInvoices();
                }}
            />

            {/* ── Invoice Creator Modal (Edit) ── */}
            <InvoiceCreatorModal
                isOpen={Boolean(editInvoice)}
                invoice={editInvoice}
                onClose={() => setEditInvoice(null)}
                onCreated={() => {
                    setEditInvoice(null);
                    loadInvoices();
                }}
            />

            {/* ── Invoice Preview & Download Modal ── */}
            <InvoicePreviewModal
                invoice={previewInvoice}
                onClose={() => setPreviewInvoice(null)}
            />
        </div>
    );
}
