"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CustomerDetails } from "./_components/CustomerDetails";
import { ShippingAddress } from "./_components/ShippingAddress";
import { PaymentMethod } from "./_components/PaymentMethod";
import { OrderSummary } from "./_components/OrderSummary";
import { OrderPlacedSuccessfully } from "./_components/OrderPlacedSuccessfully";
import { useCart } from "../../contexts/CartContext";
import api from "../../services/api";

// Types
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

export interface CartItem {
  id: number | string;
  product_id?: string;
  title: string;
  price: string;
  imageSrc: string;
  quantity: number;
  color: string;
  storage: string;
}

// Helper functions
export const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
};

export const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
};

export const formatPrice = (amount: number): string => {
  return `Rs ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, clearCart } = useCart();

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

  const { subtotal, shipping, tax, total } = calculateTotals(cartItems);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async (promoCode: string | null, discountAmount: number, activeTotal: number) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setIsLoading(true);
    try {
      // Structure the order data
      const orderPayload = {
        customer_details: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment_details: {
          cardholder: formData.cardholder,
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv,
        },
        items: cartItems.map(item => ({
          product_id: item.product_id || String(item.id),
          title: item.title,
          price: item.price,
          imageSrc: item.imageSrc,
          color: item.color,
          storage: item.storage,
          quantity: item.quantity
        })),
        subtotal: subtotal,
        discount: discountAmount,
        shipping: shipping,
        tax: (subtotal - discountAmount) * 0.18,
        total: activeTotal,
        promo_code: promoCode
      };

      await api.post("/orders/", orderPayload);
      await clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <Link
            href="/cart"
            className="p-2 hover:bg-background-dim rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-[32px] md:text-[48px] font-bold tracking-tight">
            Checkout.
          </h1>
        </motion.div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-foreground-muted mb-8">Add some products to your cart before checking out.</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Forms */}
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
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                isLoading={isLoading}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}