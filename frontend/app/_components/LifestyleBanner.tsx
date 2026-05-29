"use client";

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LifestyleBanner() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.8, 1], [0.95, 1.05]);

  return (
    <section className="relative w-full bg-white overflow-hidden py-24 md:py-32">

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] md:h-[800px] rounded-[32px] overflow-hidden group bg-black"
        >
          {/* Background Image with Parallax */}
          <motion.div style={{ scale }} className="absolute inset-0 z-0">
            <Image
              src="/product/iPhone_16_Pro_Max_05.png"
              alt="iPhone 16 Pro Lifestyle"
              fill
              className="object-contain md:object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
              priority
            />
          </motion.div>

          {/* Floating Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h2 className="text-[48px] md:text-[96px] font-bold text-white tracking-tight leading-[1.1] mb-8">
                Pro. Beyond.
              </h2>
              <p className="text-[18px] md:text-[24px] text-white/80 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                The most advanced iPhone camera system. The fastest chip in a smartphone. And a titanium design that&apos;s built to last.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="px-12 py-4 bg-white text-black rounded-full font-bold text-[17px] hover:bg-gray-100 transition-all active:scale-95">
                  Explore Pro
                </button>
              </div>
            </motion.div>
          </div>

          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000 z-10" />
        </motion.div>
      </div>
    </section>
  );
}
