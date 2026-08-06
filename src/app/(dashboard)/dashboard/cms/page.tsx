"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { getSiteContent, updateSiteSection, SiteContent } from "@/lib/firebase/cms";
import HeroForm from "@/components/dashboard/cms/HeroForm";
import TheShiftForm from "@/components/dashboard/cms/TheShiftForm";
import ProcessesForm from "@/components/dashboard/cms/ProcessesForm";
import PricingForm from "@/components/dashboard/cms/PricingForm";
import FAQForm from "@/components/dashboard/cms/FAQForm";
import AboutForm from "@/components/dashboard/cms/AboutForm";
import TestimonialsForm from "@/components/dashboard/cms/TestimonialsForm";
import LayoutForm from "@/components/dashboard/cms/LayoutForm";
import PagesForm from "@/components/dashboard/cms/PagesForm";

const TABS = [
    { id: "hero", label: "Hero Section" },
    { id: "theShift", label: "The Shift" },
    { id: "processes", label: "Processes" },
    { id: "pricing", label: "Pricing Stages" },
    { id: "faq", label: "FAQ" },
    { id: "about", label: "About Me" },
    { id: "testimonials", label: "Testimonials" },
    { id: "layout", label: "Landing Layout" },
    { id: "pages", label: "Dynamic Pages" },
];

export default function CMSDashboard() {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<{type: 'success'|'error', message: string} | null>(null);

    useEffect(() => {
        async function fetchContent() {
            const data = await getSiteContent();
            setContent(data || {});
            setLoading(false);
        }
        fetchContent();
    }, []);

    const showNotification = (type: 'success'|'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async (sectionKey: string, data: any) => {
        setSaving(true);
        try {
            await updateSiteSection(sectionKey, data);
            setContent(prev => ({ ...prev, [sectionKey]: data }));
            showNotification('success', 'Changes published successfully.');
        } catch (error) {
            showNotification('error', 'Failed to publish changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-[24px] md:text-[36px] lg:text-[40px] font-black font-display text-[var(--text-primary)] mb-2">
                        Website <span className="text-orange">Content</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-base">
                        Manage the public-facing content across your landing page. Changes reflect immediately.
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                            notification.type === 'success' 
                                ? 'bg-green/10 text-green border border-green/20' 
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                    >
                        {notification.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-orange text-white shadow-lg shadow-orange/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1">
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-8">
                        {activeTab === 'hero' && (
                            <HeroForm 
                                initialData={content?.hero} 
                                onSave={(data) => handleSave('hero', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'theShift' && (
                            <TheShiftForm 
                                initialData={content?.theShift} 
                                onSave={(data) => handleSave('theShift', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'processes' && (
                            <ProcessesForm 
                                initialData={content?.processes} 
                                onSave={(data) => handleSave('processes', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'pricing' && (
                            <PricingForm 
                                initialData={content?.pricing} 
                                onSave={(data) => handleSave('pricing', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'faq' && (
                            <FAQForm 
                                initialData={content?.faq} 
                                onSave={(data) => handleSave('faq', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'about' && (
                            <AboutForm 
                                initialData={content?.about} 
                                onSave={(data) => handleSave('about', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'testimonials' && (
                            <TestimonialsForm 
                                initialData={content?.testimonialsContent} 
                                onSave={(data) => handleSave('testimonialsContent', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'layout' && (
                            <LayoutForm 
                                initialData={content?.layout} 
                                onSave={(data) => handleSave('layout', data)} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'pages' && (
                            <PagesForm 
                                showNotification={showNotification} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
