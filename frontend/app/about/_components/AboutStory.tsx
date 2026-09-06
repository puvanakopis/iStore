"use client";

import { motion } from "framer-motion";
import { Zap, Heart, Shield } from "lucide-react";

export default function AboutStory() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">

      {/* NARRATIVE */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-7 h-full"
      >
        <div className="bg-background-dim p-8 md:p-12 rounded-sm border border-border shadow-[0_40px_60px_-15px_rgba(0,0,0,0.04)] h-full flex flex-col justify-center">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-6 block">
            The Origin of Innovation
          </label>
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight mb-8">
            A Vision for Uncompromising Excellence
          </h2>
          <div className="space-y-6 text-foreground-secondary font-light text-lg leading-relaxed">
            <p>
              iStore was founded on a singular conviction: the world&apos;s most extraordinary technology deserves a retail experience of equal elegance and precision. We set out to redefine tech retail—creating a sanctuary where deep technical expertise converges with bespoke care.
            </p>
            <p>
              Today, we serve Sri Lanka&apos;s most discerning clientele, delivering authentic Apple ecosystems, master technical advisory, and immaculate after-sales protection designed to elevate every aspect of your digital lifestyle.
            </p>
          </div>
          <button className="bg-black text-white px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition mt-10 w-fit">
            Explore Collection →
          </button>
        </div>
      </motion.div>

      {/* CORE PHILOSOPHY */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="lg:col-span-5 flex flex-col justify-center space-y-10 lg:pl-12 mt-12 lg:mt-0 h-full"
      >
        <div className="bg-background-dim p-8 md:p-12 rounded-sm border border-border shadow-[0_40px_60px_-15px_rgba(0,0,0,0.04)] space-y-10 h-full flex flex-col justify-between">
          <div className="space-y-10">
            <PhilosophyItem icon={<Zap className="w-5 h-5" />} title="Uncompromised Innovation" delay={0.4}>
              Direct access to Apple&apos;s newest flagships the moment they launch, curated with flawless authenticity.
            </PhilosophyItem>

            <PhilosophyItem icon={<Heart className="w-5 h-5" />} title="White-Glove Concierge" delay={0.5}>
              Bespoke customer consultations, tailored recommendations, and ongoing technical support for your peace of mind.
            </PhilosophyItem>

            <PhilosophyItem icon={<Shield className="w-5 h-5" />} title="Authentic Distinction" delay={0.6}>
              100% official Apple products backed by global warranty coverage and certified master diagnostics.
            </PhilosophyItem>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="border-t pt-6"
          >
            <p className="text-xs uppercase tracking-widest mb-4 text-on-surface-variant">
              By the numbers
            </p>
            <div className="flex gap-10 text-sm text-black font-semibold">
              <div>
                <span className="block text-2xl font-bold">10+</span>
                <span className="text-gray-500 font-normal">Years Legacy</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">50k+</span>
                <span className="text-gray-500 font-normal">Clients Served</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">4.9/5</span>
                <span className="text-gray-500 font-normal">Client Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function PhilosophyItem({
  icon,
  title,
  children,
  delay = 0
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-black">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
}
