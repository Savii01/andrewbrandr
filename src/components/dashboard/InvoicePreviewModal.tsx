"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FiX, FiPrinter, FiDownload } from "react-icons/fi";
import { Invoice, InvoiceLineItem } from "@/lib/types/dashboard";

interface Props {
    invoice: Invoice | null;
    onClose: () => void;
}

export default function InvoicePreviewModal({ invoice, onClose }: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    if (!invoice) return null;

    /* ── Calculated totals ── */
    const lineItems: InvoiceLineItem[] = invoice.lineItems ?? [];
    const subtotal = lineItems.reduce((s, l) => s + l.qty * l.rate, 0);
    const discount = invoice.discount ?? 0;
    const taxPct = invoice.tax ?? 0;
    const afterDiscount = Math.max(0, subtotal - discount);
    const taxAmount = (afterDiscount * taxPct) / 100;
    const total = afterDiscount + taxAmount;

    const isNGN = invoice.currency === "ngn";
    const sym = isNGN ? "₦" : "$";
    const fmt = (n: number) =>
        `${sym}${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

    /* ── Print handler: targets only the invoice area ── */
    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const win = window.open("", "_blank", "width=900,height=1200");
        if (!win) return;
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #111; }
                    @media print {
                        @page { size: A4; margin: 0; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>${content.innerHTML}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
    };

    /* ── Payment block ── */
    const PaymentBlock = () => isNGN ? (
        <div style={{ lineHeight: 1.7 }}>
            <div><strong>Bank Transfer — Nigerian Naira (NGN)</strong></div>
            <div>Opay: <strong>{process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NAME?.trim()}</div>
            <div>Moniepoint: <strong>{process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NAME?.trim()}</div>
        </div>
    ) : (
        <div style={{ lineHeight: 1.7 }}>
            <div><strong>Wire / ACH Transfer — USD</strong></div>
            <div>Account Holder: <strong>{process.env.NEXT_PUBLIC_ACCOUNT_HOLDER?.trim()}</strong></div>
            <div>Account No.: <strong>{process.env.NEXT_PUBLIC_GREY_ACCOUNT_NUMBER?.trim()}</strong></div>
            <div>ACH Routing: <strong>{process.env.NEXT_PUBLIC_GREY_ACH_ROUTING?.trim()}</strong></div>
            <div>Bank: {process.env.NEXT_PUBLIC_GREY_BANK_NAME?.trim()} — {process.env.NEXT_PUBLIC_GREY_BANK_ADDRESS?.trim()}</div>
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            />

            {/* Modal shell */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="fixed inset-0 z-[95] flex items-center justify-center p-4"
            >
                <div className="relative w-full max-w-3xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                    {/* Modal header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-color)] shrink-0">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange mb-1">Finance</p>
                            <h2 className="text-xl font-display text-[var(--text-primary)]">
                                Invoice <span className="text-orange">{invoice.invoiceNumber}</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Print / Save as PDF */}
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] hover:text-orange hover:border-orange/40 transition-all"
                            >
                                <FiPrinter size={16} /> Print / Save PDF
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable preview */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* ─── PRINTABLE INVOICE DOCUMENT ─── */}
                        <div ref={printRef} style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "720px", margin: "0 auto", color: "#111", background: "#fff" }}>

                            {/* Header banner */}
                            <div style={{ background: "#0F0000", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ color: "#fff", fontWeight: 900, fontSize: "22px" }}>Saviour Andrew</div>
                                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "4px" }}>Brand Strategist &amp; Designer</div>
                                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>saviiandrewbrandr@gmail.com</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ color: "#CC3300", fontWeight: 900, fontSize: "28px" }}>INVOICE</div>
                                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>{invoice.invoiceNumber}</div>
                                </div>
                            </div>

                            <div style={{ padding: "40px" }}>

                                {/* Bill To + Dates */}
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "36px" }}>
                                    <div>
                                        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "8px" }}>Bill To</div>
                                        <div style={{ fontWeight: 900, fontSize: "15px" }}>{invoice.clientName || "—"}</div>
                                        <div style={{ color: "#666", fontSize: "13px" }}>{invoice.clientEmail || "—"}</div>
                                        {invoice.clientAddress && <div style={{ color: "#666", fontSize: "13px" }}>{invoice.clientAddress}</div>}
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700 }}>Issue Date</div>
                                        <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "12px" }}>{invoice.issueDate}</div>
                                        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700 }}>Due Date</div>
                                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#CC3300" }}>{invoice.dueDate}</div>
                                    </div>
                                </div>

                                {/* Invoice type badge */}
                                <div style={{ marginBottom: "24px" }}>
                                    <span style={{ background: "#FDF3E6", color: "#CC3300", fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                        {invoice.type} Invoice
                                    </span>
                                </div>

                                {/* Line Items Table */}
                                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                                    <thead>
                                        <tr style={{ background: "#FDF3E6" }}>
                                            <th style={{ textAlign: "left", padding: "10px 16px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>Description</th>
                                            <th style={{ textAlign: "center", padding: "10px 12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>Qty</th>
                                            <th style={{ textAlign: "right", padding: "10px 12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>Rate</th>
                                            <th style={{ textAlign: "right", padding: "10px 16px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((l, i) => {
                                            // Deliverable sub-rows have qty=0, rate=0 — hide numeric cols for them
                                            const isDeliverableRow = l.qty === 0 && l.rate === 0;
                                            return (
                                                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                    <td style={{ padding: "12px 16px", fontSize: "13px", color: isDeliverableRow ? "#777" : "#333" }}>{l.description || "—"}</td>
                                                    <td style={{ padding: "12px 12px", fontSize: "13px", color: "#555", textAlign: "center" }}>{isDeliverableRow ? "" : l.qty}</td>
                                                    <td style={{ padding: "12px 12px", fontSize: "13px", color: "#555", textAlign: "right" }}>{isDeliverableRow ? "" : fmt(l.rate)}</td>
                                                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, textAlign: "right" }}>{isDeliverableRow ? "" : fmt(l.qty * l.rate)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Totals */}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                                    <div style={{ width: "260px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                                            <span>Subtotal</span><span style={{ fontWeight: 700 }}>{fmt(subtotal)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                                                <span>Discount</span><span style={{ fontWeight: 700, color: "#16a34a" }}>−{fmt(discount)}</span>
                                            </div>
                                        )}
                                        {taxPct > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                                                <span>Tax ({taxPct}%)</span><span style={{ fontWeight: 700 }}>{fmt(taxAmount)}</span>
                                            </div>
                                        )}
                                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e5e5e5", paddingTop: "12px", fontWeight: 900, fontSize: "16px" }}>
                                            <span>Total Due</span><span style={{ color: "#CC3300" }}>{fmt(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div style={{ background: "#FDF3E6", borderRadius: "12px", padding: "24px", marginBottom: "28px", fontSize: "13px", color: "#444" }}>
                                    <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "10px" }}>Payment Details</div>
                                    <PaymentBlock />
                                </div>

                                {/* Notes */}
                                {invoice.notes && (
                                    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "20px", marginBottom: "20px" }}>
                                        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "6px" }}>Notes</div>
                                        <div style={{ fontSize: "13px", color: "#666" }}>{invoice.notes}</div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#bbb" }}>
                                    <span>andrewbrandr.com</span>
                                    <span>Thank you for your business.</span>
                                </div>

                            </div>
                        </div>
                        {/* ─── END INVOICE DOCUMENT ─── */}

                    </div>
                </div>
            </motion.div>
        </>
    );
}
