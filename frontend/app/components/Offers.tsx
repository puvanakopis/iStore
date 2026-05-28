"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Offers = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Trade In */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[600px] rounded-[24px] bg-background-alt border border-border overflow-hidden flex flex-col items-center pt-16 px-12 text-center group transition-all duration-500 shadow-[0_4px_20px_rgba(0_0_0_/_0.02)]"
          >
            <div className="z-10">
              <h3 className="text-[28px] md:text-[48px] font-bold tracking-tight mb-4">
                iStore Trade In
              </h3>
              <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-sm mb-8 leading-relaxed">
                Get $180–$650 in credit toward iPhone 16 Pro when you trade in a qualifying smartphone.
              </p>
              <div className="flex gap-6 justify-center">
                <button className="apple-button-primary scale-90">
                  Get estimate
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-0 w-full h-[320px]">
              <Image
                src="/product/iPhone_16_Pro_Max_02.png"
                alt="iPhone Trade In"
                fill
                className="object-contain object-bottom transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Card 2: Installments */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[600px] rounded-[24px] bg-background-alt border border-border overflow-hidden flex flex-col items-center pt-16 px-12 text-center group transition-all duration-500 shadow-[0_4px_20px_rgba(0_0_0_/_0.02)]"
          >
            <div className="z-10">
              <h3 className="text-[28px] md:text-[48px] font-bold tracking-tight mb-4">
                iStore Card
              </h3>
              <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-sm mb-8 leading-relaxed">
                Get 3% Daily Cash back with iStore Card. And pay for your new iPhone over time, interest-free.
              </p>
              <div className="flex gap-6 justify-center">
                <button className="apple-button-primary scale-90">
                  Apply now
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-0 w-full h-[320px]">
              <Image
                src="/product/iPhone_16_Pro_Max_03.png"
                alt="iStore Card"
                fill
                className="object-contain object-bottom transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Offers;
