"use client";

import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

interface ButtonProps {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "orange" | "whatsapp";
    icon?: IconType;
    className?: string;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
    label,
    href,
    onClick,
    variant = "primary",
    icon: Icon,
    className = "",
    fullWidth = true,
    type = "button",
}) => {
    const isPrimary = variant === "primary";
    const isSecondary = variant === "secondary";
    const isOrange = variant === "orange";
    const isWhatsapp = variant === "whatsapp";

    const baseStyles = `${fullWidth ? "flex w-full" : "inline-flex w-auto"
        } items-center justify-between gap-4 text-[15px] sm:text-[16px] py-2 px-2 pl-6 rounded-xl transition-all group`;

    let variantStyles = "";
    let iconWrapperStyles = "";

    if (isPrimary) {
        variantStyles =
            "text-white bg-gradient-to-b from-[#C9482A] to-[#AF1600] border border-[#FF6600] " +
            "hover:from-black hover:to-black hover:text-white hover:border-black " +
            "dark:hover:from-[#FFF1E3] dark:hover:to-[#FFF1E3] dark:hover:text-black dark:hover:border-[#FFF1E3]";
        iconWrapperStyles =
            "p-2.5 rounded-xl bg-white/10 dark:bg-black/20 " +
            "group-hover:bg-white/10 dark:group-hover:bg-black/10 transition-colors";
    } else if (isSecondary) {
        variantStyles =
            "text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-800 " +
            "hover:bg-black hover:text-white hover:border-black " +
            "dark:hover:bg-[#FFF1E3] dark:hover:text-black dark:hover:border-[#FFF1E3]";
        iconWrapperStyles =
            "p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 " +
            "group-hover:bg-white/10 dark:group-hover:bg-black/10 transition-colors";
    } else if (isOrange) {
        variantStyles =
            "bg-orange text-white border border-transparent " +
            "hover:bg-black hover:text-white " +
            "dark:hover:bg-white dark:hover:text-black";
        iconWrapperStyles =
            "p-2.5 rounded-xl bg-white/20 " +
            "group-hover:bg-white/10 dark:group-hover:bg-black/10 transition-colors";
    } else if (isWhatsapp) {
        variantStyles =
            "bg-green text-black border border-transparent " +
            "hover:bg-black hover:text-white " +
            "dark:hover:bg-black dark:hover:text-white";
        iconWrapperStyles =
            "p-2.5 rounded-xl bg-black/10 " +
            "group-hover:bg-white/10 transition-colors";
    }

    const content = (
        <>
            <span className="font-medium">{label}</span>
            {Icon && (
                <div className={iconWrapperStyles}>
                    <Icon className="w-5 h-5 opacity-90" />
                </div>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${baseStyles} ${variantStyles} ${className}`}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {content}
        </button>
    );
};

export default Button;
