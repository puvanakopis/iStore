"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCheckout } from "@/contexts/CheckoutContext";
import { paymentService } from "@/services/payment.service";
import { resolveImageSrc } from "@/utils/image";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isDemoParam = searchParams.get("demo_mode") === "true";
  const { clearCheckout } = useCheckout();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Clear cart immediately upon reaching success page
    clearCheckout();

    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const data = await paymentService.getSessionStatus(sessionId);
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err: any) {
        console.error("Error verifying payment session:", err);
        setError(
          err.response?.data?.detail || "Could not verify payment session status."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCheckout]);

  const isDemo = isDemoParam || order?.payment_method?.includes("demo") || (sessionId && sessionId.startsWith("cs_demo_"));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-black mb-4" />
        <h2 className="text-xl font-bold">Verifying your payment with Stripe...</h2>
        <p className="text-sm text-foreground-secondary mt-1">
          Please wait while we confirm your transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Notice</p>
            <p className="text-xs text-amber-800 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-border rounded-2xl p-8 md:p-10 shadow-sm text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50"
        >
          <CheckCircle2 size={42} className="text-green-600" />
        </motion.div>

        {isDemo ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <ShieldCheck size={14} className="text-blue-600" /> Stripe Simulated Test Payment
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 mb-3">
            <ShieldCheck size={14} /> Stripe Payment Verified
          </span>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-foreground-secondary mb-6 font-light max-w-md mx-auto">
          {isDemo
            ? "Your order has been confirmed and placed successfully in Stripe Test/Demo mode."
            : "Thank you for your purchase. Your payment has been securely processed by Stripe and your order is now being prepared."}
        </p>

        {order && (
          <div className="bg-gray-50/70 border border-border rounded-xl p-6 text-left mb-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border/60">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                  Order Number
                </p>
                <p className="text-base font-bold text-gray-900">
                  {order.id || order._id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                  Total Paid
                </p>
                <p className="text-base font-bold text-gray-900">
                  Rs. {Number(order.total || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                  Items Ordered
                </p>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-white border border-border rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={resolveImageSrc(item.imageSrc)}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-foreground-muted">
                        {item.color} • {item.storage} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="pt-3 border-t border-border/60 text-xs text-foreground-secondary">
                <p className="font-semibold text-gray-900 mb-0.5">Shipping to:</p>
                <p>
                  {order.customer_details?.firstName} {order.customer_details?.lastName}
                </p>
                <p>{order.shipping_address.address}, {order.shipping_address.city}</p>
                <p>{order.shipping_address.country} {order.shipping_address.zipCode}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            <Package size={16} />
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-24 md:pt-32 pb-20">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-black mb-3" />
            <p className="text-sm text-foreground-muted">Loading order confirmation...</p>
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </main>
  );
}
