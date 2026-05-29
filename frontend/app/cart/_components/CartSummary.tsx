'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export default function CartSummary({ subtotal, shipping, tax, total }: CartSummaryProps) {
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background-dim border border-border rounded-sm p-6 lg:p-8 sticky top-24"
        >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Order Summary
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-foreground-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-foreground-secondary">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                </div>
                <div className="flex justify-between text-sm text-foreground-secondary">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-foreground">{formatPrice(tax)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
            </div>

            <button className="w-full bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all group active:scale-[0.98]">
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 flex flex-col gap-3">
                <p className="text-[10px] text-foreground-muted text-center uppercase tracking-widest font-semibold">
                    Safe & Secure Checkout
                </p>
                <div className="flex justify-center gap-4 grayscale opacity-50">
                   {/* Placeholder for payment icons if needed */}
                </div>
            </div>
        </motion.div>
    );
}
