"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Tag,
  ChevronRight,
  Printer
} from "lucide-react";
import Link from "next/link";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onCancelOrder?: () => void;
}

const getStatusBadge = (status: string = "Confirmed") => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return {
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Confirmed"
      };
    case "shipping":
    case "shipped":
      return {
        color: "text-blue-700 bg-blue-50 border-blue-200",
        icon: <Truck className="w-3.5 h-3.5" />,
        label: "In Transit"
      };
    case "delivered":
      return {
        color: "text-green-700 bg-green-50 border-green-200",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: "Delivered"
      };
    case "cancelled":
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: "Cancelled"
      };
    default:
      return {
        color: "text-gray-700 bg-gray-50 border-gray-200",
        icon: <Package className="w-3.5 h-3.5" />,
        label: status
      };
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatPrice = (val: number | string | undefined) => {
  if (val === undefined || val === null) return "Rs. 0";
  if (typeof val === "number") {
    return `Rs. ${val.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  if (typeof val === "string") {
    if (val.startsWith("Rs.")) return val;
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(num)) {
      return `Rs. ${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return val;
  }
  return "Rs. 0";
};

const cleanImageSrc = (src: string) => {
  if (!src) return "/placeholder.png";
  let cleanSrc = src.replace("./../public", "");

  if (cleanSrc.startsWith("uploads/")) {
    cleanSrc = "/" + cleanSrc;
  }
  if (cleanSrc.startsWith("/uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${apiBase}${cleanSrc}`;
  }
  return cleanSrc;
};

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onCancelOrder,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const statusInfo = getStatusBadge(order.status);
  const isCancelled = (order.status || "").toLowerCase() === "cancelled";
  const isCancellable = (order.status || "").toLowerCase() === "confirmed";

  // Calculate tracking step
  const getStepIndex = (status: string = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return 1;
      case "processing":
        return 2;
      case "shipping":
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(order.status);

  const steps = [
    { title: "Order Placed", desc: "Order confirmed" },
    { title: "Processing", desc: "Preparing for dispatch" },
    { title: "Shipped", desc: "On the way" },
    { title: "Delivered", desc: "Package delivered" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-3xl w-full z-50 my-auto overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      Order Details
                    </h2>
                    <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      #{order.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  title="Print summary"
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden md:inline">Print</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
              {/* Order Status & Badges Banner */}
              <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                    <CreditCard className="w-3.5 h-3.5" />
                    Payment: {order.payment || "Paid"}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Total Items:{" "}
                  <span className="font-semibold text-gray-900">
                    {order.items?.reduce(
                      (acc: number, item: any) => acc + (item.quantity || 1),
                      0
                    ) || 0}
                  </span>
                </div>
              </div>

              {/* Status Tracking Steps (if not cancelled) */}
              {!isCancelled ? (
                <div className="py-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                    Tracking Progress
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                    {steps.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isDone = stepNum <= currentStep;
                      const isCurrent = stepNum === currentStep;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-sm border flex flex-col justify-between transition-all ${
                            isCurrent
                              ? "bg-black text-white border-black shadow-md scale-[1.02]"
                              : isDone
                              ? "bg-emerald-50/50 border-emerald-200 text-gray-900"
                              : "bg-gray-50 border-gray-100 text-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                                isCurrent
                                  ? "bg-white text-black"
                                  : isDone
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {isDone && !isCurrent ? "✓" : stepNum}
                            </span>
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isCurrent ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {step.title}
                            </p>
                            <p
                              className={`text-[11px] mt-0.5 font-light ${
                                isCurrent ? "text-gray-300" : "text-gray-500"
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">
                      Order Cancelled
                    </h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      This order was cancelled. If you have any questions or require a refund update, please contact our support team.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Items Ordered
                </h4>
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden bg-white">
                  {order.items?.map((item: any, idx: number) => {
                    const itemUnitPrice = formatPrice(item.price);

                    return (
                      <div
                        key={idx}
                        className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200/60">
                          <img
                            src={cleanImageSrc(item.imageSrc)}
                            alt={item.title}
                            className="w-full h-full object-contain p-1.5"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm truncate">
                            {item.title}
                          </h5>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                            {item.color && (
                              <span>
                                Color:{" "}
                                <strong className="font-medium text-gray-700">
                                  {item.color}
                                </strong>
                              </span>
                            )}
                            {item.storage && (
                              <span>
                                Storage:{" "}
                                <strong className="font-medium text-gray-700">
                                  {item.storage}
                                </strong>
                              </span>
                            )}
                            <span>
                              Qty:{" "}
                              <strong className="font-medium text-gray-700">
                                {item.quantity}
                              </strong>
                            </span>
                          </div>
                          {item.product_id && (
                            <Link
                              href={`/products/${item.product_id}`}
                              className="inline-flex items-center gap-0.5 text-xs text-black font-medium hover:underline mt-2"
                            >
                              View product <ChevronRight size={12} />
                            </Link>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900 text-sm">
                            {itemUnitPrice}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {item.quantity} x {itemUnitPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="border border-gray-100 rounded-xl p-4 bg-white space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-500" /> Customer Information
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-gray-900 text-sm">
                      {order.customer_details?.firstName}{" "}
                      {order.customer_details?.lastName || ""}
                    </p>
                    {order.customer_details?.email && (
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {order.customer_details.email}
                      </p>
                    )}
                    {order.customer_details?.phone && (
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {order.customer_details.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border border-gray-100 rounded-xl p-4 bg-white space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" /> Shipping Address
                  </h4>
                  {order.shipping_address ? (
                    <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
                      <p className="font-semibold text-gray-900">
                        {order.shipping_address.address}
                      </p>
                      <p>
                        {order.shipping_address.city}
                        {order.shipping_address.state
                          ? `, ${order.shipping_address.state}`
                          : ""}{" "}
                        {order.shipping_address.zipCode || ""}
                      </p>
                      {order.shipping_address.country && (
                        <p className="text-gray-500 font-medium">
                          {order.shipping_address.country}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No shipping address recorded.
                    </p>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-2 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Payment Summary
                </h4>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                {order.discount ? (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Discount
                    </span>
                    <span className="font-medium">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                ) : null}

                {order.promo_code && (
                  <div className="flex justify-between text-xs text-gray-500 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    <span>Promo Code ({order.promo_code})</span>
                    <span className="font-semibold text-emerald-700">Applied</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shipping === 0
                      ? "FREE"
                      : formatPrice(order.shipping)}
                  </span>
                </div>

                {order.tax ? (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                ) : null}

                <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 sticky bottom-0">
              <div>
                {isCancellable && onCancelOrder && (
                  <button
                    onClick={onCancelOrder}
                    className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-full transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-full transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
