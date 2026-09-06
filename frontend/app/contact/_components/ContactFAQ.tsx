"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RefreshCw, Wrench, CreditCard, HelpCircle } from "lucide-react";

const faqs = [
  {
    icon: ShieldCheck,
    question: "Are all products sold at iStore 100% genuine?",
    answer: "Yes, all products sold at iStore are 100% brand new, authentic Apple devices with official manufacturer warranty coverage."
  },
  {
    icon: RefreshCw,
    question: "Do you offer device trade-ins and upgrades?",
    answer: "Absolutely. You can bring your current Apple device to our Colombo showroom for an instant evaluation and credit towards your new purchase."
  },
  {
    icon: Truck,
    question: "What are your delivery timelines across Sri Lanka?",
    answer: "We offer same-day express delivery within Colombo and 1-3 business days delivery for islandwide orders across Sri Lanka."
  },
  {
    icon: Wrench,
    question: "How does technical support and warranty claim work?",
    answer: "Our in-house technical team assists with diagnostic troubleshooting, official warranty claims, and certified hardware maintenance."
  },
  {
    icon: CreditCard,
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, AMEX, bank transfers, cash on delivery (COD), and zero-cost monthly installment plans with partner banks."
  },
  {
    icon: HelpCircle,
    question: "Can I request custom Mac configurations?",
    answer: "Yes! We specialize in custom Build-To-Order (BTO) MacBooks and iMacs with expanded RAM and SSD storage tailored to your workflow."
  }
];

export default function ContactFAQ() {
  return (
    <section className="section-padding bg-white pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-on-surface-variant mb-4 block">
            Got Questions?
          </span>
          <h2 className="text-[32px] md:text-[56px] font-bold tracking-tight mb-6 text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto">
            Everything you need to know about our products, services, and store policies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background-dim p-8 rounded-sm border border-border flex flex-col justify-between shadow-[0_40px_60px_-15px_rgba(0,0,0,0.02)] hover:border-black/20 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white mb-6 border border-border">
                  <faq.icon size={22} className="text-black" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-black mb-3 tracking-tight">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-foreground-secondary font-light">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
