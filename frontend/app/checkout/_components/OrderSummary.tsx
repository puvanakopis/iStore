"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { CartItem, formatPrice } from "../page";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isLoading: boolean;
  onPlaceOrder: () => void;
}

export const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  isLoading,
  onPlaceOrder,
}: OrderSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-background-dim border border-border rounded-sm p-6 md:p-8 sticky top-24"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Order Summary
      </h2>

      {/* Order Items Preview */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b border-border/50">
            <div className="relative w-16 h-16 bg-white rounded-sm overflow-hidden flex-shrink-0">
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {item.color && `${item.color}`}
                {item.storage && ` • ${item.storage}`}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-foreground-muted">
                  Qty: {item.quantity}
                </span>
                <span className="text-sm font-medium">{item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Shipping</span>
          <span className="font-medium text-green-600">
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Estimated Tax (18% GST)</span>
          <span className="font-medium text-foreground">
            {formatPrice(tax)}
          </span>
        </div>
        <div className="pt-3 border-t border-border flex justify-between">
          <span className="text-base font-bold">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <motion.button
        onClick={onPlaceOrder}
        disabled={isLoading}
        className={`w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all group ${
          isLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:opacity-90 active:scale-[0.98]"
        }`}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Place Order
            <ArrowLeft
              className="rotate-180 group-hover:translate-x-1 transition-transform"
              size={18}
            />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};