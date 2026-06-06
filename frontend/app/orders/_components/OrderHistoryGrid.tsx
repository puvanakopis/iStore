"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "text-green-600 bg-green-50";
    case "shipped":
      return "text-blue-600 bg-blue-50";
    case "processing":
      return "text-amber-600 bg-amber-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Date unavailable";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (amount: number) => {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const cleanImageSrc = (src: string) => {
  if (!src) return "/placeholder.png";
  let cleanSrc = src.replace("./../public", "");
  
  if (cleanSrc.startsWith("uploads/")) {
    cleanSrc = "/" + cleanSrc;
  }
  if (cleanSrc.startsWith("/uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${apiBase}${cleanSrc}`;
  }
  return cleanSrc;
};

export default function OrderCard({ order }: { order: any }) {
  const { addToCart } = useCart();
  const [buyingAgain, setBuyingAgain] = useState<string | null>(null);

  const handleBuyAgain = async (item: any) => {
    setBuyingAgain(item.product_id);
    try {
      await addToCart(
        item.product_id,
        1,
        item.color,
        item.storage || "128GB",
        item.title,
        item.price,
        item.imageSrc
      );
      alert(`${item.title} added to bag successfully.`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to bag. Please try again.");
    } finally {
      setBuyingAgain(null);
    }
  };

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
            <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted font-bold mb-1">Total</p>
            <p className="text-sm font-medium">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-muted font-bold mb-1">Order #</p>
            <p className="text-sm font-medium">{order.id}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(order.status || "Pending")}`}>
          {order.status || "Pending"}
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 space-y-6">
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-6">
            <div className="relative w-24 h-24 bg-black/5 rounded-sm flex-shrink-0 flex items-center justify-center">
              <img
                src={cleanImageSrc(item.imageSrc)}
                alt={item.title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold tracking-tight truncate">{item.title}</h4>
              <p className="text-sm text-foreground-secondary font-light mt-1">Color: {item.color} • Storage: {item.storage || "N/A"} • Qty: {item.quantity}</p>
              <div className="mt-4 flex gap-4">
                <Link
                  href={`/products/${item.product_id}`}
                  className="text-[13px] font-medium text-black hover:underline flex items-center gap-1"
                >
                  View Item <ChevronRight size={14} />
                </Link>
                <button 
                  onClick={() => handleBuyAgain(item)}
                  disabled={buyingAgain === item.product_id}
                  className="text-[13px] font-medium text-black hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {buyingAgain === item.product_id ? "Adding..." : "Buy Again"} <ChevronRight size={14} />
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
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/orders/");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-sm">
        <Package size={48} className="text-foreground-muted mb-4 opacity-20" />
        <h3 className="text-xl font-bold mb-2">Sign in to view orders</h3>
        <p className="text-foreground-secondary font-light mb-8">Please log in to view your order history.</p>
        <Link href="/signin" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all">
          Sign In
        </Link>
      </div>
    );
  }

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
          <Link href="/" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
