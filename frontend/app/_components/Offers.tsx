"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Offers = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden py-20 md:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20 px-4"
        >
          <span className="text-[13px] md:text-[14px] font-semibold text-black/40 uppercase tracking-widest mb-3 block">
            Special Value
          </span>
          <h2 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight mb-5 text-black leading-[1.08]">
            Ways to save at iStore.
          </h2>
          <p className="text-[17px] sm:text-[19px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto leading-relaxed">
            Exclusive financing, trade-in rewards, and tailored payment options.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Card 1: Trade In */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#fbfbfd] border border-gray-200/80 rounded-3xl overflow-hidden transition-all duration-500 hover:border-gray-300"
          >
            <div className="relative h-[540px] md:h-[580px] flex flex-col items-center pt-12 md:pt-16 px-6 md:px-12 text-center">
              {/* Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Limited Time
                </span>
              </div>

              <div className="z-10 flex-1 flex flex-col items-center">
                <h3 className="text-[28px] md:text-[38px] font-bold tracking-tight mb-4 text-black">
                  iStore Trade In
                </h3>

                <p className="text-[16px] md:text-[18px] text-foreground-secondary font-light max-w-sm mb-6 leading-relaxed">
                  Get <span className="font-semibold text-black">Rs. 18,000–Rs. 65,000</span> in credit toward iPhone 16 Pro when you trade in a qualifying smartphone.
                </p>

                <div className="flex justify-center mt-2">
                  <Link href="/shop">
                    <button className="bg-black text-white px-7 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2">
                      <span>Get estimate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 right-0 h-[270px] md:h-[310px] pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src="/iPhone_02.png"
                    alt="iPhone Trade In"
                    fill
                    className="object-contain object-bottom transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Installments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#fbfbfd] border border-gray-200/80 rounded-3xl overflow-hidden transition-all duration-500 hover:border-gray-300"
          >
            <div className="relative h-[540px] md:h-[580px] flex flex-col items-center pt-12 md:pt-16 px-6 md:px-12 text-center">
              {/* Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Interest-Free
                </span>
              </div>

              <div className="z-10 flex-1 flex flex-col items-center">
                <h3 className="text-[28px] md:text-[38px] font-bold tracking-tight mb-4 text-black">
                  iStore Card
                </h3>

                <p className="text-[16px] md:text-[18px] text-foreground-secondary font-light max-w-sm mb-6 leading-relaxed">
                  Get <span className="font-semibold text-black">3% Daily Cash back</span> with iStore Card. Pay for your new iPhone over time, <span className="font-semibold text-black">interest‑free</span>.
                </p>

                <div className="flex justify-center mt-2">
                  <Link href="/shop">
                    <button className="bg-black text-white px-7 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2">
                      <span>Apply now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 right-0 h-[270px] md:h-[310px] pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src="/iPhone_03.png"
                    alt="iStore Card"
                    fill
                    className="object-contain object-bottom transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Offers;