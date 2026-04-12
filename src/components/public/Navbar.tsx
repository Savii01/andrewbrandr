"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSun, FaMoon } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useThemeContext } from "@/lib/context/ThemeContext";
import Button from "./Button";
import { MdArrowOutward } from "react-icons/md";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme, darkMode } = useThemeContext();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const closeMenu = () => setIsOpen(false);

    if (!mounted) return <div className="fixed w-full h-20 bg-white dark:bg-black z-[1000]" />;

    return (
        <>
            {/* Top Bar */}
            <div className="fixed w-full h-20 bg-white dark:bg-black text-black rounded-b-xl dark:text-white border-b border-black dark:border-gray-700 flex justify-between items-center px-4 md:px-8 lg:px-16 z-[1000]">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black">
                        <Image
                            src="/images/ig-profile.png"
                            alt="Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-[16px] tracking-tighter font-bold md:text-[20px] dark:text-white">
                        AndrewBrandr
                    </h2>
                </Link>

                {/* Desktop Menu & Theme Toggle */}
                <div className="hidden lg:flex items-center gap-4">
                    <ul className="flex lg:items-center lg:justify-center gap-6 lg:gap-10">
                        <li>
                            <Link href="/" className="cursor-pointer hover:font-semibold hover:text-orange py-2 px-4 dark:text-white">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="cursor-pointer hover:font-semibold hover:text-orange py-2 px-4 dark:text-white">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/projects" className="cursor-pointer hover:font-semibold hover:text-orange py-2 px-4 dark:text-white">
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Button
                                href="/work-with-me"
                                label="Let's Work together"
                                variant="secondary"
                                icon={MdArrowOutward}
                                fullWidth={false}
                                className="!py-1"
                            />
                        </li>
                    </ul>
                    {/* Theme Toggle Button for Desktop */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="ml-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-white transition"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <FaSun size={24} className="hover:text-orange" /> : <FaMoon size={24} className="hover:text-orange" />}
                    </button>
                </div>

                {/* Mobile Menu Icons */}
                <div className="flex lg:hidden items-center">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="mr-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <FaSun size={24} className="hover:text-orange" /> : <FaMoon size={24} className="hover:text-orange" />}
                    </button>
                    <AiOutlineMenu
                        size={24}
                        className="text-black dark:text-white cursor-pointer hover:font-bold"
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[1000]"
                    onClick={closeMenu}
                ></div>
            )}

            {/* Mobile Menu */}
            <div
                className={`${isOpen ? "translate-x-0" : "translate-x-full"
                    } fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-3/4 lg:hidden bg-white dark:bg-gray-900 text-black dark:text-white border-l-2 border-orange transition-transform duration-300 ease-in-out flex flex-col p-6 z-[1001] shadow-2xl`}
            >
                {/* Close Icon */}
                <AiOutlineClose
                    size={24}
                    className="absolute top-5 right-5 cursor-pointer text-black dark:text-white"
                    onClick={closeMenu}
                />

                {/* Mobile Menu Links */}
                <ul className="flex flex-col gap-6 pt-16">
                    <li>
                        <Link href="/" className="cursor-pointer text-lg" onClick={closeMenu}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="cursor-pointer text-lg" onClick={closeMenu}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className="cursor-pointer text-lg" onClick={closeMenu}>
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link href="/work-with-me" className="cursor-pointer text-lg hover:text-orange transition-all" onClick={closeMenu}>
                            Work with me
                        </Link>
                    </li>
                    <li>
                        <Link href="/send-message" className="cursor-pointer text-lg hover:text-orange transition-all" onClick={closeMenu}>
                            Send a Message
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
