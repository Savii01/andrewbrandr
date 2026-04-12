"use client";

import React, { useEffect, useState } from "react";
import Button from "./public/Button";
import { FaCreditCard } from "react-icons/fa";

interface PaystackButtonProps {
    email: string;
    amount: number; // in NGN (scaled from the price)
    onSuccess: (reference: string) => void;
    onClose: () => void;
}

declare global {
    interface Window {
        PaystackPop: any;
    }
}

const PaystackButton: React.FC<PaystackButtonProps> = ({ email, amount, onSuccess, onClose }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;

        script.onload = () => {
            setScriptLoaded(true);
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePay = () => {
        if (!scriptLoaded || !window.PaystackPop) return;

        const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: amount * 100, // Paystack uses kobo
            currency: "NGN",
            callback: (response: any) => {
                onSuccess(response.reference);
            },
            onClose: () => {
                onClose();
            },
        });

        handler.openIframe();
    };

    return (
        <Button
            label={scriptLoaded ? "Pay Now & Start Project" : "Initializing Paystack..."}
            onClick={handlePay}
            variant="primary"
            icon={FaCreditCard}
            fullWidth={true}
            className="!py-5 !rounded-2xl text-xl"
        />
    );
};

export default PaystackButton;
