import { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { getCustomPages, saveCustomPage, deleteCustomPage, CustomPage } from "@/lib/firebase/cms";

interface PagesFormProps {
    showNotification: (type: 'success' | 'error', msg: string) => void;
}

export default function PagesForm({ showNotification }: PagesFormProps) {
    const [pages, setPages] = useState<CustomPage[]>([]);
    const [activePageIdx, setActivePageIdx] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Active page editor states
    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        const data = await getCustomPages();
        setPages(data);
        setLoading(false);
        if (data.length > 0) {
            selectPage(0, data);
        } else {
            setActivePageIdx(null);
            resetEditor();
        }
    };

    const selectPage = (index: number, activePagesList = pages) => {
        const page = activePagesList[index];
        if (page) {
            setActivePageIdx(index);
            setSlug(page.slug);
            setTitle(page.title);
            setContent(page.content);
            setSeoDescription(page.seoDescription || "");
            setIsNew(false);
        }
    };

    const resetEditor = () => {
        setSlug("");
        setTitle("");
        setContent("");
        setSeoDescription("");
        setIsNew(true);
        setActivePageIdx(null);
    };

    const handleCreateNew = () => {
        resetEditor();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug.trim() || !title.trim()) {
            showNotification('error', 'Slug and Title are required.');
            return;
        }

        const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

        setSaving(true);
        try {
            await saveCustomPage(formattedSlug, {
                title: title.trim(),
                content: content,
                seoDescription: seoDescription.trim(),
                createdAt: new Date()
            });

            showNotification('success', `Page /${formattedSlug} saved successfully!`);
            
            // Reload all pages
            const updated = await getCustomPages();
            setPages(updated);
            
            // Find saved page index to keep active
            const foundIdx = updated.findIndex(p => p.slug === formattedSlug);
            if (foundIdx !== -1) {
                selectPage(foundIdx, updated);
            } else {
                loadPages();
            }
        } catch (err) {
            showNotification('error', 'Failed to save page.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (targetSlug: string) => {
        if (!confirm(`Are you sure you want to delete the dynamic page /${targetSlug}?`)) return;
        setSaving(true);
        try {
            await deleteCustomPage(targetSlug);
            showNotification('success', `Page /${targetSlug} deleted successfully.`);
            await loadPages();
        } catch (err) {
            showNotification('error', 'Failed to delete page.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">Dynamic Pages Creator</h2>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">Create fully responsive custom landing or sub-pages on the fly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[var(--border-color)]">
                {/* Left Pane - List of Pages */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Custom Pages</span>
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            className="text-xs text-orange font-bold flex items-center gap-1 hover:underline"
                        >
                            <FiPlus /> New Page
                        </button>
                    </div>

                    {pages.map((p, idx) => (
                        <div
                            key={p.slug || idx}
                            onClick={() => selectPage(idx)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                                activePageIdx === idx && !isNew
                                    ? "bg-orange/10 border-orange text-orange"
                                    : "bg-[var(--surface-elevated)] border-[var(--border-color)] hover:border-orange/50 text-[var(--text-primary)]"
                            }`}
                        >
                            <div className="text-left flex items-start gap-3">
                                <FiFileText size={18} className="mt-0.5 text-[var(--text-muted)]" />
                                <div>
                                    <span className="text-xs font-bold text-[var(--text-muted)] block">/{p.slug}</span>
                                    <span className="font-bold text-sm">{p.title || "Untitled Page"}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleDelete(p.slug); }}
                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
                                title="Delete page"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {pages.length === 0 && (
                        <p className="text-xs text-[var(--text-muted)] italic">No custom pages created yet.</p>
                    )}
                </div>

                {/* Right Pane - Page Form Editor */}
                <form onSubmit={handleSave} className="lg:col-span-2 space-y-4 bg-[var(--surface-elevated)] border border-[var(--border-color)] p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-base font-bold text-[var(--text-primary)]">
                            {isNew ? "Create New Dynamic Page" : `Editing Page: /${slug}`}
                        </h4>
                        {isNew && (
                            <span className="text-xs font-bold px-2 py-1 bg-green/10 text-green rounded-lg uppercase">Drafting</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">URL Slug (e.g. brand-guide)</label>
                            <input
                                type="text"
                                required
                                disabled={!isNew}
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                placeholder="brand-guide"
                                className="w-full bg-[var(--surface)] disabled:opacity-50 border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                        </div>
                        <div className="space-y-1 col-span-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Page Title (renders as H1)</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Our Brand Book Guidelines"
                                className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">SEO Meta Description</label>
                            <input
                                type="text"
                                value={seoDescription}
                                onChange={e => setSeoDescription(e.target.value)}
                                placeholder="Read through our official brand strategy and collateral guidelines."
                                className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-bold focus:ring-1 focus:ring-orange"
                            />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Page Body Content (Markdown Supported)</label>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] italic">Supports # headers, **bold**, and bullet lists</span>
                            </div>
                            <textarea
                                rows={12}
                                required
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="# Section Heading&#10;&#10;Provide details here...&#10;&#10;## Key Guidelines&#10;- Color choices&#10;- Typography scales"
                                className="w-full bg-[var(--surface)] border-none rounded-lg p-3 text-xs font-medium focus:ring-1 focus:ring-orange font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                        {!isNew && (
                            <a
                                href={`/${slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-orange hover:underline"
                            >
                                View Live Page →
                            </a>
                        )}
                        <div className="ml-auto">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-orange text-white text-xs font-black rounded-lg hover:bg-black transition-all shadow-md shadow-orange/20 disabled:opacity-50"
                            >
                                <FiSave size={14} />
                                {saving ? "Publishing..." : isNew ? "Create Page" : "Save Page Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
