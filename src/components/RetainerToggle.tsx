"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";

interface RetainerToggleProps {
    title: string;
    priceNGN: string;
    priceUSD: string;
    items: string[];
    selected: boolean;
    onToggle: () => void;
    isNigeria: boolean;
}

const RetainerToggle: React.FC<RetainerToggleProps> = ({
    title,
    priceNGN,
    priceUSD,
    items,
    selected,
    onToggle,
    isNigeria,
}) => {
    const price = isNigeria ? priceNGN : priceUSD;

    return (
        <div
            onClick={onToggle}
            className={`relative cursor-pointer transition-all duration-300 border rounded-[2rem] p-2 lg:p-3 overflow-hidden ${selected
                    ? "bg-orange/5 border-orange shadow-[0_0_30px_rgba(255,102,0,0.1)]"
                    : "bg-white dark:bg-lilBlack border-black/30 dark:border-gray-700"
                }`}
        >
            <div className={`p-8 md:p-10 rounded-[28px] h-full transition-colors ${selected ? "bg-orange/[0.02]" : "bg-transparent"
                }`}>
                {/* Selection Circle */}
                <div className={`absolute top-10 right-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selected
                        ? "bg-orange border-orange"
                        : "border-gray-400 dark:border-gray-600 bg-transparent"
                    }`}>
                    {selected && <FaIcons.FaCheck size={14} className="text-white" />}
                </div>

                <span className={`text-[13px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block transition-colors ${selected ? "bg-orange text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                    Add-on Retainer
                </span>

                <h3 className={`text-2xl md:text-3xl font-customFont font-bold mb-4 pr-12 ${selected ? "text-orange" : "text-black dark:text-white"
                    }`}>
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
                    Keep the momentum going after delivery with monthly brand management and consistency checks.
                </p>

                <div className="h-[1px] bg-gray-200 dark:bg-gray-800 mb-8"></div>

                <div className="flex items-baseline gap-2 mb-8">
                    <span className={`text-4xl font-customFont font-bold transition-colors ${selected ? "text-orange" : "text-black dark:text-white"
                        }`}>
                        {price}
                    </span>
                    <span className="text-gray-500 text-lg">/month</span>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-lg text-gray-700 dark:text-gray-400 space-x-3">
                            <FaIcons.FaCheck size={14} className="shrink-0 mt-1.5 text-orange" />
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-10">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${selected
                            ? "bg-orange text-white scale-105"
                            : "bg-gray-900 text-white hover:bg-black"
                        }`}>
                        {selected ? "Retainer Added" : "Add to Package"}
                        {!selected && <FaIcons.FaPlus size={12} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetainerToggle;
