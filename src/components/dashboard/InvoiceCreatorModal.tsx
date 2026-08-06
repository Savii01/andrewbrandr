"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiX, FiPlus, FiTrash2, FiPrinter, FiCheck,
    FiChevronRight, FiChevronLeft, FiEdit3
} from "react-icons/fi";
import { createInvoice, updateInvoice } from "@/lib/firebase/invoices";
import { Invoice, InvoiceLineItem } from "@/lib/types/dashboard";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    /** When provided the modal opens in edit mode pre-filled with this invoice */
    invoice?: Invoice | null;
}

const today = () => new Date().toISOString().split("T")[0];
const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
};
const nextNumber = () => {
    const y = new Date().getFullYear();
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    const r = Math.floor(100 + Math.random() * 900);
    return `INV-${y}${m}-${r}`;
};

const EMPTY_LINE: InvoiceLineItem = { description: "", qty: 1, rate: 0 };

interface StagePlan {
    name: string;
    slug: string;
    priceNGN: number;
    priceUSD: number;
    deliverables: string[];
}

const STAGE_PLANS: StagePlan[] = [
    {
        name: "Stage 01: Brand Foundation",
        slug: "foundation",
        priceNGN: 80000,
        priceUSD: 100,
        deliverables: [
            "Brand purpose and positioning",
            "Brand persona and tone",
            "Tagline direction",
            "Two concept directions",
            "Primary logo and sub mark",
            "Colour system",
            "Typography system",
            "Mini brand guidelines",
            "Business card and letterhead",
            "Final logo files in all formats"
        ]
    },
    {
        name: "Stage 02: Brand Clarity",
        slug: "clarity",
        priceNGN: 300000,
        priceUSD: 400,
        deliverables: [
            "Competitor research and positioning",
            "User persona to define your actual buyer",
            "Brand purpose, tone, and archetype",
            "Communication strategy and tagline",
            "Visual audit of existing brand assets",
            "3 concept directions with full logo exploration",
            "Primary logo, sub marks, and icon or pattern",
            "Full colour palette and typography system",
            "Full brand guidelines",
            "Corporate collaterals (business card, letterhead, envelope, signage)",
            "Social media template system with 4 recurring formats",
            "Layout and grid rules for all brand touchpoints",
            "Simplified internal usage guidelines"
        ]
    },
    {
        name: "Stage 03: Brand Scale",
        slug: "scale",
        priceNGN: 900000,
        priceUSD: 1200,
        deliverables: [
            "Full market and competitor research",
            "User persona and community triggers",
            "Brand purpose, positioning, persona, tonality, archetype, and brand enemy",
            "Communication strategy and hero, hub, hygiene framework",
            "Direction with execution plan",
            "Competitor and visual benchmarking",
            "Mood boards and 3 to 4 concept directions",
            "Full logo system (primary, sub marks, monogram, symbols)",
            "Full colour palette, typography, icon, and pattern design",
            "Comprehensive brand guidelines",
            "Full corporate collateral suite",
            "Full visual design system (grid, spacing, hierarchy, layout)",
            "Social media template system for all recurring formats",
            "Packaging design with master layout & SKU adaptations",
            "Website design covering structure, user flow, visual design, and handover"
        ]
    },
    {
        name: "Stage 04: Brand Enterprise",
        slug: "enterprise",
        priceNGN: 1500000,
        priceUSD: 2000,
        deliverables: [
            "Full custom brand operating system development",
            "Illustration design system & custom library",
            "Editorial design with grid system and template suite",
            "Motion design (logo animation, social motion graphics)",
            "Design system documentation for internal/external teams",
            "Sub-brand or product brand development",
            "Ongoing brand governance and consultation"
        ]
    }
];

type Step = 1 | 2 | 3;

export default function InvoiceCreatorModal({ isOpen, onClose, onCreated, invoice }: Props) {
    const isEditMode = Boolean(invoice?.id);

    const [step, setStep] = useState<Step>(1);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    /* ── Form state ── */
    const [meta, setMeta] = useState({
        invoiceNumber: nextNumber(),
        issueDate: today(),
        dueDate: addDays(14),
        currency: "ngn" as "ngn" | "usd",
        type: "custom" as "deposit" | "milestone" | "final" | "retainer" | "custom",
        status: "draft" as "draft" | "sent",
    });
    const [client, setClient] = useState({
        clientName: "",
        clientEmail: "",
        clientAddress: "",
    });

    const [selectedStage, setSelectedStage] = useState<string>("custom");
    const [stagePrice, setStagePrice] = useState<number>(0);

    const [lines, setLines] = useState<InvoiceLineItem[]>([{ ...EMPTY_LINE }]);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [notes, setNotes] = useState("Payment should be made within the due date stated above. Thank you for your business.");

    /* ── Populate / reset when modal opens or invoice changes ── */
    useEffect(() => {
        if (!isOpen) return;
        setSaved(false);
        setStep(1);

        if (invoice && invoice.id) {
            // ── EDIT MODE: pre-fill from existing invoice ──
            setMeta({
                invoiceNumber: invoice.invoiceNumber ?? nextNumber(),
                issueDate: invoice.issueDate ?? today(),
                dueDate: invoice.dueDate ?? addDays(14),
                currency: invoice.currency ?? "ngn",
                type: invoice.type ?? "custom",
                status: (invoice.status === "draft" || invoice.status === "sent") ? invoice.status : "draft",
            });
            setClient({
                clientName: invoice.clientName ?? "",
                clientEmail: invoice.clientEmail ?? "",
                clientAddress: invoice.clientAddress ?? "",
            });
            setLines(invoice.lineItems?.length ? invoice.lineItems : [{ ...EMPTY_LINE }]);
            setDiscount(invoice.discount ?? 0);
            setTax(invoice.tax ?? 0);
            setNotes(invoice.notes ?? "Payment should be made within the due date stated above. Thank you for your business.");
            // In edit mode we always treat as custom (line items are already populated)
            setSelectedStage("custom");
            setStagePrice(0);
        } else {
            // ── CREATE MODE: blank slate ──
            setMeta({ invoiceNumber: nextNumber(), issueDate: today(), dueDate: addDays(14), currency: "ngn", type: "custom", status: "draft" });
            setClient({ clientName: "", clientEmail: "", clientAddress: "" });
            setSelectedStage("custom");
            setStagePrice(0);
            setLines([{ ...EMPTY_LINE }]);
            setDiscount(0);
            setTax(0);
            setNotes("Payment should be made within the due date stated above. Thank you for your business.");
        }
    }, [isOpen, invoice]);

    /* ── Sync Price/Lines when Stage or Currency changes ── */
    useEffect(() => {
        if (selectedStage === "custom") return;

        const plan = STAGE_PLANS.find(p => p.slug === selectedStage);
        if (!plan) return;

        const defaultPrice = meta.currency === "ngn" ? plan.priceNGN : plan.priceUSD;
        setStagePrice(defaultPrice);

        // Build list: 1st line is Package fee, others are free-form deliverables with rate 0 and qty 0
        const newLines: InvoiceLineItem[] = [
            {
                description: `${plan.name} - Package Investment`,
                qty: 1,
                rate: defaultPrice
            },
            ...plan.deliverables.map(d => ({
                description: `• ${d}`,
                qty: 0,
                rate: 0
            }))
        ];
        setLines(newLines);
    }, [selectedStage, meta.currency]);

    /* ── Calculations ── */
    const subtotal = lines.reduce((s, l) => s + l.qty * l.rate, 0);
    const afterDiscount = Math.max(0, subtotal - discount);
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;

    const sym = meta.currency === "ngn" ? "₦" : "$";
    const fmt = (n: number) => `${sym}${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

    /* ── Line item helpers ── */
    const updateLine = (i: number, field: keyof InvoiceLineItem, val: string | number) =>
        setLines(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
    const addLine = () => setLines(prev => [...prev, { ...EMPTY_LINE }]);
    const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i));

    // Handle package price change directly
    const handleStagePriceChange = (val: number) => {
        setStagePrice(val);
        setLines(prev => {
            const copy = [...prev];
            if (copy[0]) {
                copy[0] = { ...copy[0], rate: val };
            }
            return copy;
        });
    };

    /* ── Save (create or update) ── */
    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...meta,
                ...client,
                lineItems: lines,
                discount,
                tax,
                notes,
                amount: total,
                description: lines.map(l => l.description).join(", "),
            };

            if (isEditMode && invoice?.id) {
                await updateInvoice(invoice.id, payload);
            } else {
                await createInvoice(payload);
            }

            setSaved(true);
            onCreated?.();
        } catch (e) {
            console.error(e);
            alert("Failed to save invoice. Check your Firestore rules.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Print ── */
    const handlePrint = () => window.print();

    /* ── Payment details by currency ── */
    const paymentBlock = meta.currency === "ngn" ? (
        <div className="invoice-payment-block">
            <p><strong>Bank Transfer — Nigerian Naira (NGN)</strong></p>
            <p>Opay: <strong>{process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NAME?.trim()}</p>
            <p>Moniepoint: <strong>{process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NAME?.trim()}</p>
        </div>
    ) : (
        <div className="invoice-payment-block">
            <p><strong>Wire / ACH Transfer — USD</strong></p>
            <p>Account Holder: <strong>{process.env.NEXT_PUBLIC_ACCOUNT_HOLDER?.trim()}</strong></p>
            <p>Account No.: <strong>{process.env.NEXT_PUBLIC_GREY_ACCOUNT_NUMBER?.trim()}</strong></p>
            <p>ACH Routing: <strong>{process.env.NEXT_PUBLIC_GREY_ACH_ROUTING?.trim()}</strong></p>
            <p>Bank: {process.env.NEXT_PUBLIC_GREY_BANK_NAME?.trim()} — {process.env.NEXT_PUBLIC_GREY_BANK_ADDRESS?.trim()}</p>
        </div>
    );

    if (!isOpen) return null;

    return (
        <>
            {/* ── Backdrop ── */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm no-print"
            />

            {/* ── Modal shell ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="fixed inset-0 z-[95] flex items-center justify-center p-4 no-print"
            >
                <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-color)] shrink-0">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange mb-1">Finance</p>
                            <h2 className="text-xl font-display text-[var(--text-primary)] flex items-center gap-2">
                                {isEditMode ? (
                                    <><FiEdit3 size={18} className="text-orange" /> Edit Invoice</>
                                ) : "New Invoice"}
                            </h2>
                            {isEditMode && (
                                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-bold">{invoice?.invoiceNumber}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Steps */}
                            <div className="flex items-center gap-2 text-xs font-bold">
                                {([1, 2, 3] as Step[]).map(s => (
                                    <button key={s} onClick={() => setStep(s)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${step === s ? "bg-orange text-white" : step > s ? "bg-green/20 text-green" : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"}`}>
                                        {step > s ? <FiCheck size={12} /> : s}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-0.5 bg-[var(--surface-elevated)] shrink-0">
                        <motion.div className="h-full bg-orange" animate={{ width: `${(step / 3) * 100}%` }} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <AnimatePresence mode="wait">

                            {/* ── Step 1: Client & Meta ── */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">Client details & invoice metadata</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Name *</label>
                                            <input value={client.clientName} onChange={e => setClient(p => ({ ...p, clientName: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]"
                                                placeholder="e.g. Nexova Technologies" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Email *</label>
                                            <input type="email" value={client.clientEmail} onChange={e => setClient(p => ({ ...p, clientEmail: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]"
                                                placeholder="client@company.com" />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Address</label>
                                            <input value={client.clientAddress} onChange={e => setClient(p => ({ ...p, clientAddress: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]"
                                                placeholder="e.g. 12 Victoria Island, Lagos, Nigeria" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Invoice Number</label>
                                            <input value={meta.invoiceNumber} onChange={e => setMeta(p => ({ ...p, invoiceNumber: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Issue Date</label>
                                            <input type="date" value={meta.issueDate} onChange={e => setMeta(p => ({ ...p, issueDate: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Due Date</label>
                                            <input type="date" value={meta.dueDate} onChange={e => setMeta(p => ({ ...p, dueDate: e.target.value }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Currency</label>
                                            <div className="flex gap-3">
                                                {(["ngn", "usd"] as const).map(c => (
                                                    <button key={c} type="button" onClick={() => setMeta(p => ({ ...p, currency: c }))}
                                                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${meta.currency === c ? "bg-orange border-orange text-white" : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-orange/40"}`}>
                                                        {c === "ngn" ? "🇳🇬 NGN" : "🌍 USD"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Project Stage / Package</label>
                                            <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]">
                                                <option value="custom">Custom Invoice (Freeform items)</option>
                                                <option value="foundation">Stage 01: Brand Foundation</option>
                                                <option value="clarity">Stage 02: Brand Clarity</option>
                                                <option value="scale">Stage 03: Brand Scale</option>
                                                <option value="enterprise">Stage 04: Brand Enterprise</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Invoice Type</label>
                                            <select value={meta.type} onChange={e => setMeta(p => ({ ...p, type: e.target.value as any }))}
                                                className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]">
                                                <option value="custom">Custom</option>
                                                <option value="deposit">Deposit</option>
                                                <option value="milestone">Milestone</option>
                                                <option value="final">Final Balance</option>
                                                <option value="retainer">Retainer</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 2: Line Items ── */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    {selectedStage !== "custom" ? (
                                        /* ── STAGE-BASED LAYOUT (SINGLE EDITABLE PRICE + AUTO DELIVERABLES) ── */
                                        <div className="space-y-6">
                                            <div className="p-5 rounded-2xl bg-orange/5 border border-orange/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-orange uppercase tracking-wider">Stage-Based Package Selected</p>
                                                    <h4 className="text-base font-black text-[var(--text-primary)] mt-1">
                                                        {STAGE_PLANS.find(p => p.slug === selectedStage)?.name}
                                                    </h4>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Package Price (Editable)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">{sym}</span>
                                                        <input
                                                            type="number"
                                                            value={stagePrice || ""}
                                                            onChange={e => handleStagePriceChange(Number(e.target.value))}
                                                            className="w-44 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl py-2.5 pl-8 pr-3 text-sm font-black focus:ring-2 focus:ring-orange text-[var(--text-primary)]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Included Deliverables (Read-Only)</label>
                                                <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-elevated)]/30 max-h-64 overflow-y-auto space-y-2">
                                                    {lines.slice(1).map((line, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                                            <span>{line.description.replace(/^•\s*/, "")}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── FREEFORM / CUSTOM LAYOUT ── */
                                        <div className="space-y-6">
                                            <p className="text-sm text-[var(--text-secondary)] font-medium">Add services, deliverables or milestones</p>

                                            <div className="grid grid-cols-[1fr_80px_120px_100px_36px] gap-3 px-2">
                                                {["Description", "Qty", "Rate", "Amount", ""].map(h => (
                                                    <p key={h} className="text-[10px] uppercase font-bold text-[var(--text-muted)]">{h}</p>
                                                ))}
                                            </div>

                                            <div className="space-y-3">
                                                {lines.map((line, i) => (
                                                    <div key={i} className="grid grid-cols-[1fr_80px_120px_100px_36px] gap-3 items-center">
                                                        <input value={line.description} onChange={e => updateLine(i, "description", e.target.value)}
                                                            placeholder="e.g. Brand Identity System"
                                                            className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                                        <input type="number" min="1" value={line.qty} onChange={e => updateLine(i, "qty", Number(e.target.value))}
                                                            className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)] text-center" />
                                                        <input type="number" min="0" value={line.rate} onChange={e => updateLine(i, "rate", Number(e.target.value))}
                                                            className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                                        <p className="text-sm font-bold text-[var(--text-primary)] text-right">
                                                            {fmt(line.qty * line.rate)}
                                                        </p>
                                                        <button onClick={() => removeLine(i)} disabled={lines.length === 1}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors disabled:opacity-30">
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button onClick={addLine} className="flex items-center gap-2 text-sm font-bold text-orange hover:text-orange/70 transition-colors">
                                                <FiPlus size={16} /> Add Line Item
                                            </button>
                                        </div>
                                    )}

                                    {/* Totals */}
                                    <div className="border-t border-[var(--border-color)] pt-6 space-y-3 ml-auto w-full max-w-xs">
                                        <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                            <span className="font-medium">Subtotal</span>
                                            <span className="font-bold">{fmt(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-[var(--text-secondary)]">Discount</span>
                                            <input type="number" min="0" value={discount} onChange={e => setDiscount(Number(e.target.value))}
                                                className="w-28 bg-[var(--surface-elevated)] border-none rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)] text-right" />
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-[var(--text-secondary)]">Tax (%)</span>
                                            <input type="number" min="0" max="100" value={tax} onChange={e => setTax(Number(e.target.value))}
                                                className="w-28 bg-[var(--surface-elevated)] border-none rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-orange text-[var(--text-primary)] text-right" />
                                        </div>
                                        <div className="flex justify-between text-base font-black text-[var(--text-primary)] border-t border-[var(--border-color)] pt-3">
                                            <span>Total</span>
                                            <span className="text-orange">{fmt(total)}</span>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Footer Notes</label>
                                        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                                            className="w-full bg-[var(--surface-elevated)] border-none rounded-xl p-3 text-sm font-medium resize-none focus:ring-2 focus:ring-orange text-[var(--text-primary)]" />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 3: Preview ── */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium mb-6">Review your invoice before saving or printing.</p>

                                    {/* PRINTABLE INVOICE DOCUMENT */}
                                    <div id="invoice-print-area" className="bg-white text-black rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

                                        {/* Invoice Header */}
                                        <div className="flex justify-between items-start p-10" style={{ background: "#0F0000" }}>
                                            <div>
                                                <p className="text-white font-black text-2xl tracking-tight">Saviour Andrew</p>
                                                <p className="text-white/60 text-sm font-medium mt-1">Brand Strategist & Designer</p>
                                                <p className="text-white/50 text-xs mt-1">saviiandrewbrandr@gmail.com</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#CC3300] font-black text-3xl tracking-tight">INVOICE</p>
                                                <p className="text-white/80 text-sm font-bold mt-1">{meta.invoiceNumber}</p>
                                            </div>
                                        </div>

                                        <div className="p-10 space-y-8">

                                            {/* Bill To + Dates */}
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Bill To</p>
                                                    <p className="font-black text-base text-gray-900">{client.clientName || "—"}</p>
                                                    <p className="text-sm text-gray-500 font-medium">{client.clientEmail || "—"}</p>
                                                    {client.clientAddress && <p className="text-sm text-gray-500 font-medium">{client.clientAddress}</p>}
                                                </div>
                                                <div className="text-right space-y-2">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Issue Date</p>
                                                        <p className="font-bold text-gray-800 text-sm">{meta.issueDate}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Due Date</p>
                                                        <p className="font-bold text-[#CC3300] text-sm">{meta.dueDate}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Line Items Table */}
                                            <div className="overflow-hidden rounded-xl border border-gray-100">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr style={{ background: "#FDF3E6" }}>
                                                            <th className="text-left px-5 py-3 text-[10px] uppercase font-black text-gray-500 tracking-widest">Description</th>
                                                            <th className="text-center px-4 py-3 text-[10px] uppercase font-black text-gray-500 tracking-widest">Qty</th>
                                                            <th className="text-right px-4 py-3 text-[10px] uppercase font-black text-gray-500 tracking-widest">Rate</th>
                                                            <th className="text-right px-5 py-3 text-[10px] uppercase font-black text-gray-500 tracking-widest">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {lines.map((l, i) => {
                                                            // Hide quantity, rate, and amount for child deliverables (qty=0, rate=0)
                                                            const isChildDeliverable = selectedStage !== "custom" && i > 0;
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="px-5 py-4 font-medium text-gray-800">{l.description || "—"}</td>
                                                                    <td className="px-4 py-4 text-center text-gray-600">{isChildDeliverable ? "" : l.qty}</td>
                                                                    <td className="px-4 py-4 text-right text-gray-600">{isChildDeliverable ? "" : fmt(l.rate)}</td>
                                                                    <td className="px-5 py-4 text-right font-bold text-gray-900">{isChildDeliverable ? "" : fmt(l.qty * l.rate)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Totals */}
                                            <div className="flex justify-end">
                                                <div className="w-72 space-y-2">
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>Subtotal</span><span className="font-bold text-gray-800">{fmt(subtotal)}</span>
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="flex justify-between text-sm text-gray-500">
                                                            <span>Discount</span><span className="font-bold text-green-600">−{fmt(discount)}</span>
                                                        </div>
                                                    )}
                                                    {tax > 0 && (
                                                        <div className="flex justify-between text-sm text-gray-500">
                                                            <span>Tax ({tax}%)</span><span className="font-bold text-gray-800">{fmt(taxAmount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-black text-gray-900">
                                                        <span>Total Due</span>
                                                        <span style={{ color: "#CC3300" }}>{fmt(total)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Details */}
                                            <div className="rounded-xl p-6 space-y-2 text-sm" style={{ background: "#FDF3E6" }}>
                                                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-3">Payment Details</p>
                                                {paymentBlock}
                                            </div>

                                            {/* Notes */}
                                            {notes && (
                                                <div className="border-t border-gray-100 pt-6">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Notes</p>
                                                    <p className="text-sm text-gray-500 font-medium">{notes}</p>
                                                </div>
                                            )}

                                            {/* Footer */}
                                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400">
                                                <span>andrewbrandr.com</span>
                                                <span>Thank you for your business.</span>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer nav */}
                    <div className="flex items-center justify-between px-8 py-5 border-t border-[var(--border-color)] shrink-0 bg-[var(--surface-elevated)]/50">
                        <button
                            onClick={() => step > 1 ? setStep((step - 1) as Step) : onClose()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)] transition-all">
                            <FiChevronLeft size={16} />{step === 1 ? "Cancel" : "Back"}
                        </button>

                        <div className="flex items-center gap-3">
                            {step === 3 && (
                                <>
                                    <button onClick={handlePrint}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] hover:text-orange hover:border-orange/40 transition-all">
                                        <FiPrinter size={16} /> Print / PDF
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || saved}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange text-white text-sm font-bold hover:bg-black transition-all disabled:opacity-60 shadow-lg shadow-orange/20">
                                        {saved
                                            ? <><FiCheck size={16} /> {isEditMode ? "Updated!" : "Saved!"}</>
                                            : saving ? "Saving…"
                                            : isEditMode ? "Update Invoice" : "Save Invoice"
                                        }
                                    </button>
                                </>
                            )}
                            {step < 3 && (
                                <button
                                    onClick={() => setStep((step + 1) as Step)}
                                    disabled={step === 1 && (!client.clientName || !client.clientEmail)}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange text-white text-sm font-bold hover:bg-black transition-all disabled:opacity-40 shadow-lg shadow-orange/20">
                                    Continue <FiChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── PRINTABLE INVOICE (rendered outside modal for clean print) ── */}
            <div className="print-only" id="invoice-full-print">
                <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "0 auto", color: "#111" }}>
                    {/* Header */}
                    <div style={{ background: "#0F0000", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ color: "#fff", fontWeight: 900, fontSize: "22px" }}>Saviour Andrew</div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "4px" }}>Brand Strategist & Designer</div>
                            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>saviiandrewbrandr@gmail.com</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#CC3300", fontWeight: 900, fontSize: "28px" }}>INVOICE</div>
                            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>{meta.invoiceNumber}</div>
                        </div>
                    </div>

                    <div style={{ padding: "40px" }}>
                        {/* Bill To + Dates */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "36px" }}>
                            <div>
                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "8px" }}>Bill To</div>
                                <div style={{ fontWeight: 900, fontSize: "15px" }}>{client.clientName}</div>
                                <div style={{ color: "#666", fontSize: "13px" }}>{client.clientEmail}</div>
                                {client.clientAddress && <div style={{ color: "#666", fontSize: "13px" }}>{client.clientAddress}</div>}
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700 }}>Issue Date</div>
                                <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "12px" }}>{meta.issueDate}</div>
                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700 }}>Due Date</div>
                                <div style={{ fontWeight: 700, fontSize: "13px", color: "#CC3300" }}>{meta.dueDate}</div>
                            </div>
                        </div>

                        {/* Table */}
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
                                {lines.map((l, i) => {
                                    const isChildDeliverable = selectedStage !== "custom" && i > 0;
                                    return (
                                        <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#333" }}>{l.description}</td>
                                            <td style={{ padding: "12px 12px", fontSize: "13px", color: "#555", textAlign: "center" }}>{isChildDeliverable ? "" : l.qty}</td>
                                            <td style={{ padding: "12px 12px", fontSize: "13px", color: "#555", textAlign: "right" }}>{isChildDeliverable ? "" : fmt(l.rate)}</td>
                                            <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, textAlign: "right" }}>{isChildDeliverable ? "" : fmt(l.qty * l.rate)}</td>
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
                                {tax > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                                        <span>Tax ({tax}%)</span><span style={{ fontWeight: 700 }}>{fmt(taxAmount)}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e5e5e5", paddingTop: "12px", fontWeight: 900, fontSize: "15px" }}>
                                    <span>Total Due</span><span style={{ color: "#CC3300" }}>{fmt(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div style={{ background: "#FDF3E6", borderRadius: "12px", padding: "24px", marginBottom: "28px", fontSize: "13px", color: "#444", lineHeight: "1.7" }}>
                            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "10px" }}>Payment Details</div>
                            {meta.currency === "ngn" ? (
                                <>
                                    <div><strong>Bank Transfer — Nigerian Naira (NGN)</strong></div>
                                    <div>Opay: <strong>{process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_OPAY_ACCOUNT_NAME?.trim()}</div>
                                    <div>Moniepoint: <strong>{process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NUMBER?.trim()}</strong> — {process.env.NEXT_PUBLIC_MONIEPOINT_ACCOUNT_NAME?.trim()}</div>
                                </>
                            ) : (
                                <>
                                    <div><strong>Wire / ACH Transfer — USD</strong></div>
                                    <div>Account Holder: <strong>{process.env.NEXT_PUBLIC_ACCOUNT_HOLDER?.trim()}</strong></div>
                                    <div>Account No.: <strong>{process.env.NEXT_PUBLIC_GREY_ACCOUNT_NUMBER?.trim()}</strong></div>
                                    <div>ACH Routing: <strong>{process.env.NEXT_PUBLIC_GREY_ACH_ROUTING?.trim()}</strong></div>
                                    <div>Bank: {process.env.NEXT_PUBLIC_GREY_BANK_NAME?.trim()} — {process.env.NEXT_PUBLIC_GREY_BANK_ADDRESS?.trim()}</div>
                                </>
                            )}
                        </div>

                        {/* Notes */}
                        {notes && (
                            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "20px", marginBottom: "20px" }}>
                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontWeight: 700, marginBottom: "6px" }}>Notes</div>
                                <div style={{ fontSize: "13px", color: "#666" }}>{notes}</div>
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#bbb" }}>
                            <span>andrewbrandr.com</span>
                            <span>Thank you for your business.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
