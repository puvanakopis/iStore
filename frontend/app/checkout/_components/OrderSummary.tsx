"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Tag, X } from "lucide-react";
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

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.10,
  APPLE10: 0.10,
  ISTORE20: 0.20,
};

export const OrderSummary = ({
  items,
  subtotal,
  shipping,
  isLoading,
  onPlaceOrder,
}: OrderSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPromo = localStorage.getItem('applied_promo');
      if (savedPromo && PROMO_CODES[savedPromo.toUpperCase()]) {
        setAppliedPromo(savedPromo.toUpperCase());
      }
    }
  }, []);

  const handleApplyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(cleanCode);
      setError(null);
      setPromoInput('');
      if (typeof window !== 'undefined') {
        localStorage.setItem('applied_promo', cleanCode);
      }
    } else {
      setError('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('applied_promo');
    }
  };

  const discountRate = appliedPromo ? (PROMO_CODES[appliedPromo] || 0) : 0;
  const discount = subtotal * discountRate;
  const activeSubtotal = subtotal - discount;
  const activeTax = activeSubtotal * 0.18; // 18% GST
  const activeTotal = activeSubtotal + shipping + activeTax;

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

        {discount > 0 && (
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Discount ({appliedPromo})</span>
            <span className="font-medium text-green-600">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Shipping</span>
          <span className="font-medium text-green-600">
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Estimated Tax (18% GST)</span>
          <span className="font-medium text-foreground">
            {formatPrice(activeTax)}
          </span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between">
          <span className="text-base font-bold">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(activeTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Accordion */}
      <div className="border-t border-border/50 pt-4 mb-6">
        {!appliedPromo ? (
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs font-semibold text-foreground hover:text-black/70 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>{isOpen ? 'Close' : 'Have a Promo Code?'}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (error) setError(null);
                      }}
                      className="flex-grow bg-white border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors uppercase"
                    />
                    <button
                      onClick={() => handleApplyPromo(promoInput)}
                      className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 ml-3 font-medium">{error}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-black/[0.03] border border-border/50 rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-foreground-muted" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">{appliedPromo}</span>
              <span className="text-xs text-green-600 font-medium">({discountRate * 100}% OFF Applied)</span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-foreground-muted hover:text-red-500 transition-colors p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <motion.button
        onClick={onPlaceOrder}
        disabled={isLoading}
        className={`w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all group cursor-pointer ${
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