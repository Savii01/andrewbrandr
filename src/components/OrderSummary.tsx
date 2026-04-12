"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";

interface OrderSummaryProps {
    packageName: string;
    packagePrice: string;
    retainerName?: string;
    retainerPrice?: string;
    isRetainerSelected: boolean;
    className?: string;
    showTotal?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    packageName,
    packagePrice,
    retainerName,
    retainerPrice,
    isRetainerSelected,
    className = "",
    showTotal = true,
}) => {
    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
    };

    const currencySymbol = packagePrice.includes("₦") ? "₦" : "$";
    const baseAmount = parsePrice(packagePrice);
    const retainerAmount = retainerPrice ? parsePrice(retainerPrice) : 0;
    const totalAmount = baseAmount + (isRetainerSelected ? retainerAmount : 0);

    const formatCurrency = (amount: number) => {
        return currencySymbol + amount.toLocaleString();
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="space-y-6">
                {/* Item: Main Package */}
                <div className="flex justify-between items-end group">
                    <div className="space-y-1">
                        <span className="text-[15px] font-bold text-gray-400">Project Selection</span>
                        <h4 className="text-black font-bold text-lg leading-none">{packageName}</h4>
                    </div>
                    <div className="text-right">
                        <span className="text-black font-customFont font-bold text-2xl">{packagePrice}</span>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="h-[1px] w-full bg-gray-100"></div>

                {/* Item: Retainer (Conditional) */}
                {isRetainerSelected && retainerName && retainerPrice && (
                    <div className="flex justify-between items-end animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="space-y-1">
                            <span className="text-[15px] font-bold text-orange">Optional add-on</span>
                            <h4 className="text-orange font-bold text-lg leading-none">{retainerName}</h4>
                        </div>
                        <div className="text-right">
                            <span className="text-orange font-customFont font-bold text-2xl">+{retainerPrice}</span>
                        </div>
                    </div>
                )}

                {/* Line Separator for Total */}
                {(isRetainerSelected || showTotal) && (
                    <div className="pt-4 mt-2">
                        <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div>
                                <span className="text-[18px] font-bold text-black block mb-1">Total investment</span>
                                <span className="text-gray-400 text-[14px] font-medium tracking-tight">Initial deposit + Monthly retainer</span>
                            </div>
                            <div className="text-right">
                                <span className="text-black font-customFont font-bold text-3xl block">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Note */}
            <div className="mt-8 flex items-center gap-3 group">
                <FaIcons.FaShieldAlt size={14} className="text-gray-300 group-hover:text-orange transition-colors" />
                <span className="text-[14px] font-bold text-gray-400">Secure checkout</span>
            </div>
        </div>
    );
};

export default OrderSummary;
