"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { OrderHistoryGrid } from "./_components/OrderHistoryGrid";

export default function Orders() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight mb-2">Order History</h1>
            <p className="text-foreground-secondary font-light">Track your orders and view your purchase history.</p>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1">
            <OrderHistoryGrid />
          </div>
        </div>
      </section>
    </main>
  );
}
