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
            The Beginning
          </label>
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight mb-8">
            A Vision for Excellence
          </h2>
          <div className="space-y-6 text-foreground-secondary font-light text-lg leading-relaxed">
            <p>
              iStore was born from a simple observation: the world&apos;s most advanced 
              technology deserves a retail experience that is equally advanced. We 
              set out to create a sanctuary for Apple enthusiasts—a place where 
              product knowledge meets personalized care.
            </p>
            <p>
              Today, we serve thousands of customers across the region, providing 
              them with not just iPhones and MacBooks, but the technical expertise 
              and support that allows them to push the boundaries of their creativity.
            </p>
          </div>
          <button className="bg-black text-white px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition mt-10 w-fit">
            Join Our Journey →
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
            <PhilosophyItem icon={<Zap className="w-5 h-5" />} title="Speed of Innovation" delay={0.4}>
              We stay ahead of the curve, ensuring you get access to the latest Apple releases the moment they drop.
            </PhilosophyItem>

            <PhilosophyItem icon={<Heart className="w-5 h-5" />} title="Customer First" delay={0.5}>
              Our white-glove service ensures that every interaction is tailored to your unique needs.
            </PhilosophyItem>

            <PhilosophyItem icon={<Shield className="w-5 h-5" />} title="Unmatched Quality" delay={0.6}>
              As an authorized partner, we guarantee 100% genuine products with full international warranties.
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
                <span className="text-gray-500 font-normal">Years</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">50k+</span>
                <span className="text-gray-500 font-normal">Clients</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">4.9/5</span>
                <span className="text-gray-500 font-normal">Rating</span>
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
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-black">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
}
