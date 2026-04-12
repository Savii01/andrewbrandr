"use client";

import React from 'react';
import Link from 'next/link';
import { testimonials } from '@/data';
import { generateAvatar } from '@/lib/utils/generateAvatar';
import { MdArrowOutward } from 'react-icons/md';

import Button from './Button';

/**
 * CTA component with customer social proof.
 * Uses generateAvatar for fallback customer images.
 */
const CTAWithTestimonials = () => {
  return (
    <div className="my-28 relative bg-gray-100 dark:bg-lilBlack dark:text-white rounded-3xl overflow-hidden px-6 sm:px-12 py-20 text-center">
      {/* Link wrapper for the testimonial section */}
      <Link href="/" className="block my-16 hover:opacity-90 transition-opacity duration-300">
        <div className="flex flex-col items-center justify-center">
          {/* Customer Avatars - Restored and active */}
          <div className="flex -space-x-4 mb-4">
            {testimonials.slice(0, 5).map((testimonial, index) => (
              <div key={index} className="relative">
                <img
                  src={generateAvatar(testimonial.name)}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            ))}
          </div>

          {/* Stars and label */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex space-x-0">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-black dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>

            <p className="mt-2 text-black dark:text-white font-semibold text-[14px]">
              99+ Happy Clients
            </p>
          </div>
        </div>
      </Link>

      {/* CTA Content */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl font-customFont mb-4 text-black dark:text-white">
          Like what you see?
        </h2>
        <p className="text-[18px] opacity-90 mb-10 text-gray-700 dark:text-gray-300">
          We&apos;re bold, brilliant, and built to bring brands to life. Let’s give yours the glow-up it deserves.
        </p>
        <Button
          href="/send-message"
          label="Let's Make Magic ✨"
          variant="orange"
          icon={MdArrowOutward}
          fullWidth={false}
        />
      </div>
    </div>
  );
};

export default CTAWithTestimonials;
