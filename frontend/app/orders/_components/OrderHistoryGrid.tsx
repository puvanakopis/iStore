"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/productData";

const orders = [
  {
    id: "ORD-92837",
    date: "May 24, 2026",
    status: "Delivered",
    statusColor: "text-green-600 bg-green-50",
    total: "Rs. 429,998",
    items: [
      { ...products[0], quantity: 1, color: "Midnight" },
      { ...products[1], quantity: 1, color: "Space Gray" },
    ],
  },
  {
    id: "ORD-91726",
    date: "April 12, 2026",
    status: "Shipped",
    statusColor: "text-blue-600 bg-blue-50",
    total: "Rs. 229,999",
    items: [
      { ...products[2], quantity: 1, color: "Silver" },
    ],
  },
];

export default function OrderCard({ order }: { order: typeof orders[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-border bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted font-bold mb-1">Order Placed</p>
            <p className="text-sm font-medium">{order.date}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted font-bold mb-1">Total</p>
            <p className="text-sm font-medium">{order.total}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted font-bold mb-1">Order #</p>
            <p className="text-sm font-medium">{order.id}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${order.statusColor}`}>
          {order.status}
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 space-y-6">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-6">
            <div className="relative w-24 h-24 bg-black/5 rounded-sm flex-shrink-0">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold tracking-tight truncate">{item.title}</h4>
              <p className="text-sm text-foreground-secondary font-light mt-1">Color: {item.color} • Qty: {item.quantity}</p>
              <div className="mt-4 flex gap-4">
                <Link
                  href={`/products/${item.id}`}
                  className="text-[13px] font-medium text-black hover:underline flex items-center gap-1"
                >
                  View Item <ChevronRight size={14} />
                </Link>
                <button className="text-[13px] font-medium text-black hover:underline flex items-center gap-1">
                  Buy Again <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer Actions */}
      <div className="px-6 py-4 bg-gray-50/30 border-t border-border flex justify-end gap-3">
        <button className="px-5 py-2 text-xs font-bold border border-border rounded-full hover:bg-black/5 transition-all">
          Track Package
        </button>
        <button className="px-5 py-2 text-xs font-bold border border-border rounded-full hover:bg-black/5 transition-all">
          Order Details
        </button>
        <button className="px-5 py-2 text-xs font-bold bg-black text-white rounded-full hover:scale-[1.02] transition-all">
          Get Help
        </button>
      </div>
    </motion.div>
  );
}

export function OrderHistoryGrid() {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-sm">
          <Package size={48} className="text-foreground-muted mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-foreground-secondary font-light mb-8">When you buy items, they will appear here.</p>
          <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all">
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
}
