"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const OrderPlacedSuccessfully = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle size={40} className="text-green-600" />
      </motion.div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Order Placed Successfully!
      </h2>
      <p className="text-foreground-secondary mb-2 max-w-md">
        Thank you for your purchase. Your order has been confirmed and will be
        shipped soon.
      </p>
      <p className="text-sm text-foreground-muted mb-8">
        Order confirmation sent to your email
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="px-8 py-3 border border-border rounded-full font-medium hover:bg-black/5 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="px-8 py-3 bg-black text-white rounded-full font-medium hover:opacity-90 transition-all"
        >
          View Orders
        </Link>
      </div>
    </motion.div>
  );
};