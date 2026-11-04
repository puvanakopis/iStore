"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { CustomerDetails } from "./_components/CustomerDetails";
import { ShippingAddress } from "./_components/ShippingAddress";
import { PaymentMethod } from "./_components/PaymentMethod";
import { OrderSummary } from "./_components/OrderSummary";
import { OrderPlacedSuccessfully } from "./_components/OrderPlacedSuccessfully";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useAuth } from "../../contexts/AuthContext";
import { paymentService } from "../../services/payment.service";
import api from "../../services/api";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholder: string;
}

export interface CheckoutLineItem {
  id: string;
  product_id: string;
  title: string;
  price: string;
  imageSrc: string;
  quantity: number;
  color: string;
  storage: string;
}

const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
};

const calculateTotals = (item: CheckoutLineItem | null) => {
  if (!item) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
  const subtotal = parsePrice(item.price) * item.quantity;
  const shipping = 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
};

function CheckoutContent() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const { checkoutItem, clearCheckout } = useCheckout();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get("canceled") === "true";

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholder: "",
  });

  // Pre-fill user data when user logs in or is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.first_name || "",
        lastName: prev.lastName || user.last_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  const lineItem: CheckoutLineItem | null = checkoutItem
    ? {
        id: checkoutItem.product_id,
        product_id: checkoutItem.product_id,
        title: checkoutItem.title,
        price: checkoutItem.price,
        imageSrc: checkoutItem.imageSrc,
        quantity: checkoutItem.quantity,
        color: checkoutItem.color,
        storage: checkoutItem.storage,
      }
    : null;

  const items = lineItem ? [lineItem] : [];
  const { subtotal, shipping, tax, total } = calculateTotals(lineItem);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePlaceOrder = async (
    promoCode: string | null,
    discountAmount: number,
    activeTotal: number
  ) => {
    if (!checkoutItem) {
      alert("No product selected for checkout.");
      return;
    }

    if (!formData.firstName.trim() || !formData.email.trim()) {
      setErrorMessage("Please provide your first name and email address.");
      return;
    }

    if (!formData.address.trim() || !formData.city.trim()) {
      setErrorMessage("Please complete your shipping address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customer_details: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || "N/A",
        },
        shipping_address: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || "Western Province",
          zipCode: formData.zipCode.trim() || "00000",
          country: formData.country.trim() || "Sri Lanka",
        },
        payment_details: null,
        payment_method: paymentMethod,
        items: [
          {
            product_id: checkoutItem.product_id,
            title: checkoutItem.title,
            price: checkoutItem.price,
            imageSrc: checkoutItem.imageSrc,
            color: checkoutItem.color,
            storage: checkoutItem.storage,
            quantity: checkoutItem.quantity,
          },
        ],
        subtotal: subtotal,
        discount: discountAmount,
        shipping: shipping,
        tax: (subtotal - discountAmount) * 0.18,
        total: activeTotal,
        promo_code: promoCode,
      };

      if (paymentMethod === "stripe") {
        const res = await paymentService.createCheckoutSession(orderPayload);
        if (res.checkout_url) {
          window.location.href = res.checkout_url;
          return;
        }
      } else {
        const codPayload = {
          ...orderPayload,
          payment: "Pending (COD)",
          status: "Processing",
          payment_method: "cod",
        };
        await api.post("/orders/", codPayload);
        clearCheckout();
        setOrderPlaced(true);
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      const detail =
        error.response?.data?.detail ||
        error.message ||
        "Failed to place order. Please try again.";
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <OrderPlacedSuccessfully />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 md:px-12">
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
            Checkout.
          </h1>
        </motion.div>

        {isCanceled && (
          <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-start gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Payment was cancelled</p>
              <p className="text-xs text-blue-800 mt-0.5">
                Your checkout session was cancelled. You can review your details and proceed to payment whenever you are ready.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Checkout Notice</p>
              <p className="text-xs text-red-800 mt-1 whitespace-pre-line leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {!checkoutItem ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">No product selected</h2>
            <p className="text-foreground-muted mb-8">
              Choose a product and tap Checkout to start your order.
            </p>
            <Link
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <CustomerDetails
                formData={formData}
                onInputChange={handleInputChange}
              />
              <ShippingAddress
                formData={formData}
                onInputChange={handleInputChange}
              />
              <PaymentMethod
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />
            </div>

            <div className="lg:col-span-5">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                isLoading={isLoading}
                onPlaceOrder={handlePlaceOrder}
                buttonText={paymentMethod === "stripe" ? "Pay with Stripe" : "Place Order (COD)"}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
