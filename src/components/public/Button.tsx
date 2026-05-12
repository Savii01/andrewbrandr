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
        } items-center justify-center gap-2 text-[15px] sm:text-[16px] py-3 px-6 rounded-[55px] transition-all duration-300 group`;

    let variantStyles = "";

    if (isPrimary) {
        variantStyles =
            "text-white bg-gradient-to-b from-[#C9482A] to-[#AF1600] border border-[#FF6600] " +
            "hover:from-black hover:to-black hover:text-white hover:border-black";
    } else if (isSecondary) {
        variantStyles =
            "text-black bg-transparent border border-gray-300 " +
            "hover:bg-black hover:text-white hover:border-black";
    } else if (isOrange) {
        variantStyles =
            "bg-orange text-white border border-transparent " +
            "hover:bg-[#5C1500] hover:text-white";
    } else if (isWhatsapp) {
        variantStyles =
            "bg-green text-black border border-transparent " +
            "hover:bg-black hover:text-white";
    }

    const content = (
        <>
            <span className="font-bold tracking-wide whitespace-nowrap">{label}</span>
            {Icon && (
                <div className="flex items-center justify-center transition-colors">
                    <Icon className="w-[1em] h-[1em] opacity-90" />
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
