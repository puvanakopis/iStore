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
  id: number;
  title: string;
  price: string;
  imageSrc: string;
  quantity: number;
  color: string;
  storage: string;
}

// Mock cart data
const CHECKOUT_ITEMS: CartItem[] = [
  {
    id: 1,
    title: "iPhone 16 Pro Max",
    price: "Rs. 399,900",
    imageSrc: "/product/iPhone_16_Pro_Max_01.png",
    quantity: 1,
    color: "Natural Titanium",
    storage: "256GB",
  },
  {
    id: 2,
    title: "Apple Watch Series 9",
    price: "Rs. 45,900",
    imageSrc: "/product/iPhone_16_Pro_Max_03.png",
    quantity: 1,
    color: "Midnight",
    storage: "45mm",
  },
];

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

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "Johnathan",
    lastName: "Doe",
    email: "john.doe@icloud.com",
    phone: "+94 77 123 4567",
    address: "1 Infinite Loop",
    city: "Cupertino",
    state: "CA",
    zipCode: "95014",
    country: "United States",
    cardNumber: "**** **** **** 4242",
    expiry: "12/28",
    cvv: "***",
    cardholder: "Johnathan Doe",
  });

  const { subtotal, shipping, tax, total } = calculateTotals(CHECKOUT_ITEMS);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setOrderPlaced(true);
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
              items={CHECKOUT_ITEMS}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              isLoading={isLoading}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </section>
    </main>
  );
}