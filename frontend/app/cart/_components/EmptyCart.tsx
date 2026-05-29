'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmptyCart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center"
        >
            <div className="w-24 h-24 bg-background-dim rounded-full flex items-center justify-center mb-8">
                <ShoppingBag size={40} className="text-foreground-muted" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Your bag is empty.</h2>
            <p className="text-foreground-secondary mb-10 max-w-md mx-auto">
                Looks like you haven&apos;t added anything to your bag yet. 
                Explore our latest products and find something you love.
            </p>
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all active:scale-95"
            >
                <ArrowLeft size={18} />
                Continue Shopping
            </Link>
        </motion.div>
    );
}
