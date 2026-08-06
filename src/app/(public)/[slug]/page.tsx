"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getCustomPages, CustomPage } from "@/lib/firebase/cms";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiClock } from "react-icons/fi";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } 
  }
};

export default function DynamicCustomPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  // Standard Next.js route exclusions to prevent dynamic capture conflicts
  const EXCLUDED_SLUGS = ["about", "projects", "services", "login", "send-message", "dashboard", "work-with-me"];

  useEffect(() => {
    if (EXCLUDED_SLUGS.includes(slug)) {
      setLoading(false);
      return;
    }

    async function loadPage() {
      const allPages = await getCustomPages();
      const matched = allPages.find(p => p.slug === slug);
      if (matched) {
        setPage(matched);
      }
      setLoading(false);
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF3E6]">
        <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If excluded or not found, fall back to Next.js 404 handler
  if (EXCLUDED_SLUGS.includes(slug) || !page) {
    return notFound();
  }

  // Custom high-performance markdown to HTML renderer
  const renderMarkdown = (markdownText: string) => {
    if (!markdownText) return "";
    
    const lines = markdownText.split("\n");
    let inList = false;
    const htmlLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check bullet items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          inList = true;
          htmlLines.push('<ul class="list-disc pl-6 space-y-2 my-4 text-gray-700 dark:text-gray-300 font-medium">');
        }
        const bulletText = parseInlineMarkdown(trimmed.substring(2));
        htmlLines.push(`<li>${bulletText}</li>`);
        return;
      } else {
        if (inList) {
          inList = false;
          htmlLines.push('</ul>');
        }
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        htmlLines.push(`<h1 class="text-3xl md:text-4xl font-black text-[#0F0000] dark:text-white mt-10 mb-4 font-display tracking-tight">${parseInlineMarkdown(trimmed.substring(2))}</h1>`);
      } else if (trimmed.startsWith("## ")) {
        htmlLines.push(`<h2 class="text-2xl md:text-3xl font-black text-[#0F0000] dark:text-white mt-8 mb-4 font-display tracking-tight">${parseInlineMarkdown(trimmed.substring(3))}</h2>`);
      } else if (trimmed.startsWith("### ")) {
        htmlLines.push(`<h3 class="text-xl md:text-2xl font-black text-[#0F0000] dark:text-white mt-6 mb-3 font-display tracking-tight">${parseInlineMarkdown(trimmed.substring(4))}</h3>`);
      } else if (trimmed === "") {
        htmlLines.push('<div class="h-4"></div>');
      } else {
        htmlLines.push(`<p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4 font-medium">${parseInlineMarkdown(trimmed)}</p>`);
      }
    });

    if (inList) {
      htmlLines.push('</ul>');
    }

    return htmlLines.join("\n");
  };

  const parseInlineMarkdown = (text: string) => {
    // Bold text (**bold**)
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#0F0000] dark:text-white">$1</strong>');
    // Code ticks (`code`)
    parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-orange/10 text-orange px-1.5 py-0.5 rounded text-xs font-mono font-bold">$1</code>');
    return parsed;
  };

  return (
    <div className="pt-32 bg-[#FDF3E6] dark:bg-black min-h-screen pb-24 selection:bg-orange selection:text-white">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#0F0000]/60 dark:text-white/60 hover:text-orange transition-colors mb-16 text-sm font-bold uppercase tracking-widest"
        >
          <FiArrowLeft size={16} />
          Back to home
        </Link>

        <motion.article
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="bg-white dark:bg-[#0c0000] border border-gray-200 dark:border-gray-900 rounded-2xl p-8 md:p-12 shadow-xl shadow-orange/5"
        >
          {/* Article Header */}
          <header className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-900">
            <h1 className="text-[36px] md:text-[48px] font-black text-[#0F0000] dark:text-white leading-tight font-display tracking-tight mb-4">
              {page.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <FiClock />
                Custom Page
              </span>
              <span>/ {slug}</span>
            </div>
          </header>

          {/* Article Content Body */}
          <div 
            className="prose prose-orange max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
          />
        </motion.article>

      </div>
    </div>
  );
}
