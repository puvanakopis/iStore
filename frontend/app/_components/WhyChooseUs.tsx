"use client";

import {
  Truck,
  ShieldCheck,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BadgeCheck,
    title: "Original Products",
    description:
      "100% genuine Apple devices guaranteed directly from authorized supply chains.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Enjoy free express nationwide shipping and convenient local pickup options.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Support",
    description: "Includes official 2-year extended hardware protection and support plan.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Secure checkout with 0% interest-free flexible installment options.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-20 md:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24 px-4"
        >
          <span className="text-[13px] md:text-[14px] font-semibold text-black/40 uppercase tracking-widest mb-3 block">
            Why iStore
          </span>
          <h2 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight mb-5 text-black leading-[1.08]">
            The iStore Difference
          </h2>
          <p className="text-[17px] sm:text-[19px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto leading-relaxed">
            Experience the gold standard in premium Apple retail.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-[#fbfbfd] p-8 rounded-3xl border border-gray-200/80 flex flex-col items-center text-center group hover:border-gray-300 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-black/5 rounded-2xl group-hover:scale-110 transition duration-500" />
                <feature.icon
                  size={32}
                  className="text-black relative z-10 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>

              {/* Feature Title */}
              <h3 className="text-[20px] font-bold text-black mb-3 tracking-tight">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-[14px] leading-relaxed text-foreground-secondary font-light max-w-[260px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}