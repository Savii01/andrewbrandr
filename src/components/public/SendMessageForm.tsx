"use client";

import React, { useState } from "react";
import Button from "./Button";
import { FaWhatsapp } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

const SendMessageForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [showAlert, setShowAlert] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) return;

        // Normal HTML Mail (mailto)
        const subject = encodeURIComponent(`Message from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );

        // Open default mail client
        window.location.href = `mailto:[EMAIL_ADDRESS]?subject=${subject}&body=${body}`;

        // Set whatsapp message for the second button
        const message = `Hello Saviour 👋, I have a question:\n\n${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.email}`;
        setWhatsappMessage(message);

        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setFormData({ name: "", email: "", message: "" });
    };

    const whatsappLink = `https://wa.me/2347012636013?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <div className="bg-gray-100 dark:bg-lilBlack p-2 rounded-2xl ">
            {showAlert && (
                <div className="px-4 py-3 text-white bg-green rounded mb-4">
                    ✅ Mail client opened!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-left">
                    <label className="block text-sm mb-1 dark:text-gray-500 text-black">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-4 rounded-lg border border-gray-400 dark:border-gray-700 dark:bg-lilBlack dark:text-white text-black text-sm"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm mb-1 dark:text-gray-500 text-black">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-4 rounded-lg border border-gray-400 dark:border-gray-700 dark:bg-lilBlack dark:text-white text-black text-sm"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm mb-1 dark:text-gray-500 text-black">
                        Your Message *
                    </label>
                    <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-400 dark:border-gray-700 dark:bg-lilBlack dark:text-white mb-4 text-black text-sm"
                    />
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        type="submit"
                        label="Send Message"
                        variant="primary"
                        icon={MdArrowOutward

                        }
                    />

                    {whatsappMessage && (
                        <Button
                            href={whatsappLink}
                            label="Send via WhatsApp"
                            variant="whatsapp"
                            icon={FaWhatsapp}
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default SendMessageForm;
