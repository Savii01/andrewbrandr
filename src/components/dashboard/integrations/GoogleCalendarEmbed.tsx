"use client";

import { FiCalendar, FiClock, FiVideo, FiExternalLink } from "react-icons/fi";

interface GoogleCalendarEmbedProps {
    events?: { title: string; date: string; time: string; meetUrl?: string }[];
}

export default function GoogleCalendarEmbed({ events = [] }: GoogleCalendarEmbedProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <FiCalendar size={18} />
                </div>
                <h3 className="text-base font-black uppercase text-[var(--text-primary)]">Studio Calendar</h3>
            </div>

            <div className="space-y-3">
                {events.length > 0 ? events.map((event, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{event.title}</h4>
                                <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-muted)] uppercase">
                                    <span className="flex items-center gap-1">
                                        <FiCalendar size={12} />
                                        {event.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiClock size={12} />
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {event.meetUrl && (
                            <a
                                href={event.meetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange text-white text-xs font-black uppercase hover:bg-black transition-all shadow-xl shadow-orange/10"
                            >
                                <FiVideo size={14} />
                                Join Studio Meet
                            </a>
                        )}
                    </div>
                )) : (
                    <div className="p-12 rounded-2xl bg-[var(--surface-elevated)]/30 border border-dashed border-[var(--border-color)] text-center">
                         <p className="text-xs font-bold text-[var(--text-muted)] uppercase">No meetings scheduled</p>
                         <p className="text-xs text-[var(--text-muted)] mt-1">Synchronization with studio calendar pending</p>
                    </div>
                )}
            </div>
        </div>
    );
}
