"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CheckoutItem {
  product_id: string;
  title: string;
  price: string;
  imageSrc: string;
  quantity: number;
  color: string;
  storage: string;
}

interface CheckoutContextType {
  checkoutItem: CheckoutItem | null;
  startCheckout: (item: CheckoutItem) => void;
  updateQuantity: (quantity: number) => void;
  clearCheckout: () => void;
}

const STORAGE_KEY = "istore_checkout_item";

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

function readStoredItem(): CheckoutItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckoutItem) : null;
  } catch {
    return null;
  }
}

function writeStoredItem(item: CheckoutItem | null) {
  if (typeof window === "undefined") return;
  if (item) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCheckoutItem(readStoredItem());
  }, []);

  const startCheckout = useCallback(
    (item: CheckoutItem) => {
      writeStoredItem(item);
      setCheckoutItem(item);
      router.push("/checkout");
    },
    [router]
  );

  const updateQuantity = useCallback((quantity: number) => {
    setCheckoutItem((prev) => {
      if (!prev) return prev;
      const next = { ...prev, quantity: Math.max(1, quantity) };
      writeStoredItem(next);
      return next;
    });
  }, []);

  const clearCheckout = useCallback(() => {
    writeStoredItem(null);
    setCheckoutItem(null);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{ checkoutItem, startCheckout, updateQuantity, clearCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};
