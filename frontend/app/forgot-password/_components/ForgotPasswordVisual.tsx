"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ForgotPasswordVisual() {
  return (
    <section className="hidden md:flex relative w-1/2 min-h-screen overflow-hidden items-center justify-center px-12">

      <div className="relative w-full max-w-lg h-[600px] rounded-2xl overflow-hidden">

        {/* Background image layer */}
        <Image
          alt="Security Access"
          src="/bg_image.png"
          fill
          priority
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/80" />

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 z-10 pb-12 px-6 text-center w-full"
        >
          <span className="text-[11px] font-bold text-white/60 mb-3 block tracking-[0.2em] uppercase">
            Security First
          </span>

          <h1 className="text-[42px] font-bold leading-[1.1] tracking-tight mb-5 text-white">
            Recover your access.
          </h1>

          <p className="text-[17px] font-light text-white/65 max-w-md mx-auto leading-relaxed">
            We’ll guide you back into your account with a secure reset process.
          </p>
        </motion.div>

      </div>
    </section>
  );
}