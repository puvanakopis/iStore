"use client";

import { Mail, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactFormSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
      
      {/* FORM */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-7 h-full"
      >
        <div className="bg-background-dim p-8 md:p-12 rounded-sm border border-border shadow-[0_40px_60px_-15px_rgba(0,0,0,0.04)] h-full">
          <form className="space-y-8 h-full flex flex-col">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Full Name
                </label>
                <input
                  className="w-full bg-transparent border-b border-border py-3 focus:border-black outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Email Address
                </label>
                <input
                  className="w-full bg-transparent border-b border-border py-3 focus:border-black outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-transparent border-b border-black/10 py-3 focus:border-black outline-none resize-none"
                placeholder="How can we assist you?"
              />
            </div>

            <button className="bg-black text-white px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition mt-auto">
              Send Message →
            </button>
          </form>
        </div>
      </motion.div>

      {/* INFO */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="lg:col-span-5 flex flex-col justify-center space-y-10 lg:pl-12 mt-12 lg:mt-0 h-full"
      >
        
        <div className="bg-background-dim p-8 md:p-12 rounded-sm border border-border shadow-[0_40px_60px_-15px_rgba(0,0,0,0.04)] space-y-10 h-full flex flex-col justify-between">

          <div className="space-y-10">
            <Info icon={<MapPin />} title="Flagship Showroom" delay={0.4}>
              767 Fifth Avenue<br />New York, NY 10153
            </Info>

            <Info icon={<Clock />} title="Experience Hours" delay={0.5}>
              Mon–Fri: 09:00 - 21:00<br />Sat–Sun: 10:00 - 18:00
            </Info>

            <Info icon={<Mail />} title="Direct Inquiries" delay={0.6}>
              concierge@aether.tech<br />support@aether.tech
            </Info>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="border-t pt-6"
          >
            <p className="text-xs uppercase tracking-widest mb-4 text-on-surface-variant">
              Social Connect
            </p>
            <div className="flex gap-3 text-sm text-gray-600">
              <span>Instagram</span>
              <span>X</span>
              <span>YouTube</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}

function Info({
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
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-black">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
}