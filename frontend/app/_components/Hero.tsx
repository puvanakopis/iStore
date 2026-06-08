"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col items-center justify-center pt-24 px-6 md:px-12">
      {/* Background soft gradient - very subtle */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity }}
        >
          <span className="text-[17px] md:text-[21px] font-semibold text-black mb-4 block tracking-tight uppercase">
            New
          </span>
          <h1 className="text-[48px] md:text-[96px] font-bold leading-[1.02] tracking-tight mb-8">
            iPhone 16 Pro
          </h1>
          <p className="text-[21px] md:text-[24px] font-light text-foreground-secondary max-w-2xl mx-auto mb-12 tracking-tight leading-relaxed">
            Built for Apple Intelligence. Crafted in Grade 5 titanium. <br className="hidden md:block" />
            The most powerful iPhone ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 md:mb-24">
            <button className="apple-button-primary rounded-full">
              Buy from Rs. 99,900
            </button>
            <button className="apple-button-outline rounded-full">
              Learn more
            </button>
          </div>
        </motion.div>

        {/* Floating Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y1 }}
          className="relative w-full max-w-[900px] h-[400px] md:h-[600px]"
        >
          <Image
            src="/iPhone_01.png"
            alt="iPhone 16 Pro Max"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 900px"
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none" />
        </motion.div>
      </div>

      {/* Scrolldown indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-black/20" />
      </motion.div>
    </section>
  );
}
