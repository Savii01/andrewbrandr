"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { brands } from '@/data';

function TrustedBrands() {
  return (
    <div className="bg-white dark:bg-black pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 py-5 mt-5 max-w-lg sm:max-w-xl lg:mx-0 lg:max-w-none">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 1000 }}
            loop
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index}>
                <div className="h-12 w-full relative">
                  <img
                    alt={brand.alt}
                    src={brand.src}
                    className="max-h-12 w-full object-contain dark:filter dark:brightness-0 dark:invert"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default TrustedBrands;
