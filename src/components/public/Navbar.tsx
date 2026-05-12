"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Button from "./Button";
import { MdArrowOutward } from "react-icons/md";

const navLinks = [
    { label: "Work", href: "/projects" },
    { label: "Process", href: "/#process" },
    { label: "Stages", href: "/#stages" },
    { label: "About", href: "/about" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const closeMenu = () => setIsOpen(false);

    if (!mounted)
        return (
            <div className="fixed top-4 left-0 right-0 h-[48px] z-[1000]" />
        );

    return (
        <>
            {/* ── Desktop: Centered Floating Pill ── */}
            <header className="fixed top-4 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
                <nav className="pointer-events-auto flex items-center gap-2 bg-[#0F0000]/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-2 shadow-lg">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="hidden lg:flex items-center px-3 py-1.5 hover:opacity-80"
                    >
                        <Image
                            src="/brand_assets/secondary_logo_white.png"
                            alt="AndrewBrandr"
                            width={160}
                            height={32}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-0.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-[14px] text-white/60 font-medium rounded-full hover:text-white/90 hover:bg-white/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <Button
                        href="/work-with-me"
                        label="Start a Project"
                        icon={MdArrowOutward}
                        variant="secondary"
                        className="hidden lg:flex items-center px-5 py-2 !bg-[#fdf3e6] !text-[#0F0000] !border-[#fdf3e6]/20 hover:!border-[#fdf3e6]/40 transition-colors !text-[14px] !rounded-full !font-bold hover:!bg-[#cc3300] hover:!text-white ml-1"
                        fullWidth={false}
                    />

                    {/* Mobile: Logo + Hamburger */}
                    <div className="flex lg:hidden items-center w-full justify-between px-2">
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <Image
                                src="/brand_assets/secondary_logo_white.png"
                                alt="AndrewBrandr"
                                width={120}
                                height={24}
                                className="object-contain"
                                priority
                            />
                        </Link>
                        <AiOutlineMenu
                            size={20}
                            className="text-white/70 cursor-pointer hover:text-white ml-4"
                            onClick={() => setIsOpen(true)}
                        />
                    </div>
                </nav>
            </header>

            {/* ── Mobile Overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
                    onClick={closeMenu}
                />
            )}

            {/* ── Mobile Drawer ── */}
            <div
                className={`${isOpen ? "translate-x-0" : "translate-x-full"
                    } fixed top-0 right-0 h-full w-4/5 sm:w-1/2 lg:hidden bg-[#0F0000] text-white border-l border-white/10 transition-transform duration-300 ease-in-out flex flex-col p-8 z-[1001]`}
            >
                <AiOutlineClose
                    size={24}
                    className="absolute top-6 right-6 cursor-pointer text-white/60 hover:text-white"
                    onClick={closeMenu}
                />

                <ul className="flex flex-col gap-6 pt-16">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                className="text-xl font-bold text-white/80 hover:text-white"
                                onClick={closeMenu}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li className="pt-6 border-t border-white/10">
                        <Button
                            href="/work-with-me"
                            label="Start a Project"
                            icon={MdArrowOutward}
                            variant="secondary"
                            className="flex items-center justify-center w-full py-3 px-6 !bg-[#fdf3e6] !text-[#0F0000] !border-[#fdf3e6]/20 hover:!border-[#fdf3e6]/40 transition-colors !text-[14px] !rounded-full !font-bold hover:!bg-[#cc3300] hover:!text-white"
                            fullWidth={true}
                            onClick={closeMenu}
                        />
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
