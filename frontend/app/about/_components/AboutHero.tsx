"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative w-full bg-white overflow-hidden flex flex-col items-center justify-center pt-40 pb-20 px-6 md:px-12">
      {/* Background soft gradient - very subtle */}
      <div className="absolute inset-0 z-0 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[17px] md:text-[21px] font-semibold text-black mb-4 block tracking-tight uppercase">
            Our Story
          </span>
          <h1 className="text-[48px] md:text-[80px] font-bold leading-[1.02] tracking-tight mb-8">
            Redefining Premium Retail
          </h1>
          <p className="text-[21px] md:text-[24px] font-light text-foreground-secondary max-w-3xl mx-auto mb-12 tracking-tight leading-relaxed text-pretty">
            At iStore, we don&apos;t just sell devices. We curate experiences. 
            Since our inception, we have been committed to bringing the best of Apple 
            to your hands with a focus on design, service, and innovation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
