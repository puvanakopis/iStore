"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock, ShieldCheck, CheckCircle2, Banknote } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export const PaymentMethod = ({
  selectedMethod = "stripe",
  onSelectMethod,
}: PaymentMethodProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-border rounded-sm p-6 md:p-8"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Payment Method</h3>
          <p className="text-sm text-foreground-secondary font-light">
            Select how you would like to pay
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <CreditCard size={20} />
        </div>
      </header>

      <div className="space-y-4">
        {/* Stripe Option */}
        <div
          onClick={() => onSelectMethod("stripe")}
          className={`relative p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
            selectedMethod === "stripe"
              ? "border-black bg-black/[0.02] shadow-sm ring-1 ring-black"
              : "border-border hover:border-black/30"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedMethod === "stripe"
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "stripe" && <CheckCircle2 size={14} className="fill-current" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-gray-900">
                    Stripe Payment
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Stripe
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary font-light mt-1">
                  Pay securely with Credit / Debit Cards, Apple Pay, or Google Pay via Stripe.
                </p>

                {/* Badges for accepted cards */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50 text-[11px] text-foreground-muted font-medium">
                  <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                    VISA
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                    Mastercard
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                    AMEX
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                    Apple Pay
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                    Google Pay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash on Delivery Option */}
        <div
          onClick={() => onSelectMethod("cod")}
          className={`relative p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
            selectedMethod === "cod"
              ? "border-black bg-black/[0.02] shadow-sm ring-1 ring-black"
              : "border-border hover:border-black/30"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedMethod === "cod"
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "cod" && <CheckCircle2 size={14} className="fill-current" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-gray-900">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    COD
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary font-light mt-1">
                  Pay in cash or with card directly upon device delivery to your doorstep.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Banknote size={16} />
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 pt-4 mt-2">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <Lock size={14} className="text-green-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
