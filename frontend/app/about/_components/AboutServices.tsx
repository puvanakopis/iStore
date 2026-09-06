"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RefreshCw, Smartphone } from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Global Warranty & Support",
    description: "Every device is backed by official Apple global warranty coverage, certified diagnostics, and authentic replacement components."
  },
  {
    icon: RefreshCw,
    title: "White-Glove Trade-In",
    description: "Elevate seamlessly. Receive top-tier valuation and immediate credit towards your upgrade with our instant trade-in concierge."
  },
  {
    icon: Smartphone,
    title: "Bespoke Device Setup",
    description: "Our certified specialists handle complete data migration, security configuration, and ecosystem integration right out of the box."
  },
  {
    icon: Truck,
    title: "Insured VIP Delivery",
    description: "Fast, fully insured, and climate-controlled delivery direct to your doorstep anywhere in Sri Lanka with live dispatch tracking."
  }
];

export default function AboutServices() {
  return (
    <section className="section-padding bg-white pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-widest text-on-surface-variant mb-4 block">
            Why Choose iStore
          </span>
          <h2 className="text-[32px] md:text-[64px] font-bold tracking-tight mb-6 text-black">
            Signature Services
          </h2>
          <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto">
            Experience complete peace of mind with our curated suite of premium Apple ecosystem services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background-dim px-6 py-10 rounded-sm border border-border flex flex-col items-center text-center group shadow-[0_40px_60px_-15px_rgba(0,0,0,0.02)]"
            >
              <div className="relative w-16 h-16 flex items-center justify-center mb-8">
                <div className="absolute inset-0 bg-black/5 rounded-full scale-125 group-hover:scale-150 transition duration-500" />
                <service.icon
                  size={28}
                  className="text-black relative z-10 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>

              <h4 className="text-[21px] font-bold text-black mb-4 tracking-tight">
                {service.title}
              </h4>

              <p className="text-[15px] leading-relaxed text-foreground-secondary font-light max-w-[260px]">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
