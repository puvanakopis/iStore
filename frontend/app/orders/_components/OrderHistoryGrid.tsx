"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import OrderDetailsModal from "./OrderDetailsModal";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "text-emerald-700 bg-emerald-50 border border-emerald-200/60";
    case "shipping":
    case "shipped":
      return "text-blue-700 bg-blue-50 border border-blue-200/60";
    case "delivered":
      return "text-green-700 bg-green-50 border border-green-200/60";
    case "cancelled":
      return "text-red-700 bg-red-50 border border-red-200/60";
    default:
      return "text-gray-700 bg-gray-50 border border-gray-200/60";
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

export default function OrderCard({ order, onOrderUpdated }: { order: any; onOrderUpdated?: () => void }) {
  const { startCheckout } = useCheckout();
  const [buyingAgain, setBuyingAgain] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isCancellable = (order.status || "").toLowerCase() === "confirmed";

  const handleBuyAgain = (item: any) => {
    setBuyingAgain(item.product_id);
    try {
      startCheckout({
        product_id: item.product_id,
        quantity: 1,
        color: item.color,
        storage: item.storage || "128GB",
        title: item.title,
        price: item.price,
        imageSrc: item.imageSrc,
      });
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setBuyingAgain(null);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await api.put(`/orders/${order.id}/cancel`);
      setShowCancelModal(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.detail || "Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
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
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(order.status || "Confirmed")}`}>
          {order.status || "Confirmed"}
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
      <div className="px-6 py-4 bg-gray-50/30 border-t border-border flex flex-wrap justify-end gap-3 items-center">
        {isCancellable && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-5 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all "
          >
            Cancel Order
          </button>
        )}
        <button
          onClick={() => setShowDetailsModal(true)}
          className="px-5 py-2 text-xs font-bold border border-border rounded-full hover:bg-black/5 transition-all"
        >
          Order Details
        </button>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={order}
        onCancelOrder={() => {
          setShowDetailsModal(false);
          setShowCancelModal(true);
        }}
      />

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900">Cancel Order #{order.id}?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this order? An email confirmation will be sent to your registered address.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                disabled={cancelling}
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              >
                Keep Order
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all flex items-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function OrderHistoryGrid() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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
        <OrderCard key={order.id} order={order} onOrderUpdated={fetchOrders} />
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

