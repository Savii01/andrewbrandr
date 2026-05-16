"use client";

import { FiFolder, FiExternalLink, FiFile } from "react-icons/fi";

interface GoogleDriveEmbedProps {
    folderUrl?: string;
    files?: { name: string; url: string; type: string }[];
}

export default function GoogleDriveEmbed({ folderUrl, files = [] }: GoogleDriveEmbedProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FiFolder size={18} />
                    </div>
                    <h3 className="text-base font-black uppercase text-[var(--text-primary)]">Google Drive Assets</h3>
                </div>
                {folderUrl && (
                    <a 
                        href={folderUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-black text-orange uppercase hover:underline flex items-center gap-1"
                    >
                        Open Drive
                        <FiExternalLink size={12} />
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {files.length > 0 ? files.map((file, i) => (
                    <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-muted)] group-hover:text-orange transition-colors">
                                <FiFile size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[var(--text-primary)]">{file.name}</p>
                                <p className="text-xs text-[var(--text-muted)] font-bold uppercase">{file.type}</p>
                            </div>
                        </div>
                        <FiExternalLink size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                )) : (
                    <div className="p-12 rounded-[2rem] bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center">
                         <p className="text-xs font-bold text-[var(--text-muted)] uppercase">No assets linked yet</p>
                         <p className="text-xs text-[var(--text-muted)] mt-1">Waiting for studio asset synchronization</p>
                    </div>
                )}
            </div>
        </div>
    );
}
