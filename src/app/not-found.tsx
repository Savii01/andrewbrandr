"use client";

import React from 'react';
import Link from "next/link";
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { ThemeProvider } from '@/lib/context/ThemeContext';

export default function NotFound() {
    return (
        <ThemeProvider>
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 grid place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-white dark:bg-black">
                    <div className="text-center">
                        <p className="text-xl font-bold text-orange uppercase tracking-widest">404</p>
                        <h1 className="mt-4 text-5xl font-display tracking-tight text-black dark:text-white sm:text-7xl">
                            Chill we are working on it
                        </h1>
                        <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                            Sorry, the page you&apos;re looking for is coming soon. Stay Tuned!!!
                        </p>
                        <div className="mt-12 flex items-center justify-center gap-x-6">
                            <Link
                                href="/"
                                className="rounded-2xl bg-orange px-8 py-4 text-xl font-bold text-white shadow-lg shadow-orange/20 hover:bg-black transition-all hover:scale-105"
                            >
                                Go back home
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </ThemeProvider>
    );
}
