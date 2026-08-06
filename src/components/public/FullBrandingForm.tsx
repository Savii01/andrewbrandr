"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const FullBrandingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designStyle: "",
    businessGoals: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Hello! I have chosen the Full Branding Package. Here are my details:

Name: ${formData.name}
Email: ${formData.email}
Preferred Design Style: ${formData.designStyle}
Business Goals: ${formData.businessGoals}`;

    setWhatsappMessage(message);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_FULLBRANDING_TEMPLATE_ID!,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(() => {
        setIsSubmitted(true);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        setFormData({
          name: "",
          email: "",
          designStyle: "",
          businessGoals: "",
        });
      })
      .catch((error) => console.error("EmailJS error:", error));
  };

  const whatsappLink = `https://wa.me/2347012636013?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="max-w-3xl w-full mx-auto mt-10 text-left">
      <h2 className="text-2xl font-customFont mb-6 text-gray-900 dark:text-white text-black text-left">
        Full Branding Package Form
      </h2>

      {showAlert && (
        <div className="px-4 py-3 mb-4 text-white bg-green rounded">
          ✅ Your form was submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 text-black">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 py-3 rounded-md border border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 text-black">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 py-3 rounded-md border border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 text-black">Preferred Design Style</label>
          <select
            name="designStyle"
            value={formData.designStyle}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 py-0 rounded-md border border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
          >
            <option value="">Select style</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Modern">Modern</option>
            <option value="Playful">Playful</option>
            <option value="Corporate">Corporate</option>
            <option value="Futuristic">Futuristic</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300 text-black">Business Goals</label>
          <textarea
            name="businessGoals"
            value={formData.businessGoals}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" required className="w-4 h-4" />
          <label className="text-gray-700 dark:text-gray-300 text-sm">
            I consent to having my information stored for project communication.
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-orange text-white py-3 rounded-md hover:bg-black transition font-bold"
        >
          Submit
        </button>

        {isSubmitted && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center w-full bg-green text-black py-4 font-bold text-[18px] rounded-xl hover:bg-green/80 transition-all duration-300"
          >
            Send to WhatsApp
          </a>
        )}
      </form>
    </div>
  );
};

export default FullBrandingForm;
