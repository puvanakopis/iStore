'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartItem from './_components/CartItem';
import CartSummary from './_components/CartSummary';
import EmptyCart from './_components/EmptyCart';


export default function Cart() {
  const { cartItems, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-950"></div>
      </main>
    );
  }

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (parsePrice(item.price) * item.quantity);
  }, 0);

  const shipping = 0;
  const tax = subtotal * 0.1; 
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <Link
            href="/shop"
            className="p-2 hover:bg-background-dim rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-[32px] md:text-[48px] font-bold tracking-tight">
            Cart.
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start" key="cart-content">
              {/* Items List */}
              <div className="lg:col-span-7 flex flex-col">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="lg:col-span-5">
                <CartSummary 
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                />
              </div>
            </div>
          ) : (
            <EmptyCart key="empty-cart" />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}