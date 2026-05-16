"use client";

import { FiClipboard, FiExternalLink } from "react-icons/fi";

interface GoogleFormsEmbedProps {
    formUrl?: string;
    title?: string;
}

export default function GoogleFormsEmbed({ formUrl, title }: GoogleFormsEmbedProps) {
    if (!formUrl) return (
        <div className="p-12 rounded-[2rem] bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase">No questionnaire linked</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Waiting for studio brief configuration</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <FiClipboard size={18} />
                    </div>
                    <h3 className="text-base font-black uppercase text-[var(--text-primary)]">
                        {title || "Studio Questionnaire"}
                    </h3>
                </div>
                <a 
                    href={formUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black text-orange uppercase hover:underline flex items-center gap-1"
                >
                    Pop Out
                    <FiExternalLink size={12} />
                </a>
            </div>

            <div className="rounded-[2rem] border border-[var(--border-color)] bg-white overflow-hidden aspect-[4/5] w-full">
                <iframe
                    src={formUrl}
                    className="w-full h-full border-none"
                    title={title || "Google Form"}
                >
                    Loading...
                </iframe>
            </div>
        </div>
    );
}
