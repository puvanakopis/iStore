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
      "100% genuine Apple devices guaranteed directly from the source.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Enjoy free express shipping and convenient pickup options.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Support",
    description: "Comes with 2-year extended hardware protection plan.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Secure checkout with interest-free installment options.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-[32px] md:text-[64px] font-bold tracking-tight mb-6 text-black">
            The iStore Difference
          </h2>
          <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto">
            Experience the gold standard in premium Apple retail.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background-dim px-6 py-8 rounded-md border border-border flex flex-col items-center text-center group"
            >
                    {/* Icon */}
              <div className="relative w-18 h-18 flex items-center justify-center mb-8">
                <div className="absolute inset-0 bg-primary/4 rounded-full scale-125 group-hover:scale-150 transition duration-500" />
                <feature.icon
                  size={34}
                  className="text-black relative z-10 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>

              {/* Feature Title */}
              <h4 className="text-[21px] font-bold text-black mb-4 tracking-tight">
                {feature.title}
              </h4>

              {/* Feature Description */}
              <p className="text-[15px] leading-relaxed text-foreground-secondary font-light max-w-[260px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}