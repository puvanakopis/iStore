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
import { useCheckout } from "../../contexts/CheckoutContext";
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

export default function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { checkoutItem, clearCheckout } = useCheckout();

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
    setIsLoading(true);
    try {
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

      await api.post("/orders/", orderPayload);
      clearCheckout();
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
                formData={formData}
                onInputChange={handleInputChange}
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
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
