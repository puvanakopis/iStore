"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Offers = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 md:py-32">

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

          {/* Card 1: Trade In */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-background-dim border border-border-100 rounded-2xl overflow-hidden transition-all duration-500 "
          >
            {/* Inner content container */}
            <div className="relative h-[560px] md:h-[600px] flex flex-col items-center pt-12 md:pt-16 px-6 md:px-12 text-center">

              {/* Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                  Limited Time
                </span>
              </div>

              <div className="z-10 flex-1 flex flex-col items-center">
                <h3 className="text-[28px] md:text-[40px] font-bold tracking-tight mb-4 text-gray-900">
                  iStore Trade In
                </h3>

                <p className="text-[16px] md:text-[18px] text-gray-500 font-light max-w-sm mb-6 leading-relaxed">
                  Get <span className="font-semibold text-gray-900">Rs. 18,000–Rs. 65,000</span> in credit toward iPhone 16 Pro when you trade in a qualifying smartphone.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2">
                    Get estimate
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 right-0 h-[280px] md:h-[320px] pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src="/product/iPhone_16_Pro_Max_02.png"
                    alt="iPhone Trade In"
                    fill
                    className="object-contain object-bottom transition-all duration-700 group-hover:scale-105 group-hover:translate-y-[-8px]"
                  />
                </div>
              </div>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-gray-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Card 2: Installments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-background-dim border border-border-100 rounded-2xl overflow-hidden transition-all duration-500 "
          >
            <div className="relative h-[560px] md:h-[600px] flex flex-col items-center pt-12 md:pt-16 px-6 md:px-12 text-center">

              {/* Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                  Interest-Free
                </span>
              </div>

              <div className="z-10 flex-1 flex flex-col items-center">
                <h3 className="text-[28px] md:text-[40px] font-bold tracking-tight mb-4 text-gray-900">
                  iStore Card
                </h3>

                <p className="text-[16px] md:text-[18px] text-gray-500 font-light max-w-sm mb-6 leading-relaxed">
                  Get <span className="font-semibold text-gray-900">3% Daily Cash back</span> with iStore Card. Pay for your new iPhone over time, <span className="font-semibold text-gray-900">interest‑free</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2">
                    Apply now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 right-0 h-[280px] md:h-[320px] pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src="/product/iPhone_16_Pro_Max_03.png"
                    alt="iStore Card"
                    fill
                    className="object-contain object-bottom transition-all duration-700 group-hover:scale-105 group-hover:translate-y-[-8px]"
                  />
                </div>
              </div>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-gray-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Offers;