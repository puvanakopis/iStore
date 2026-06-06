"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string; // generated client-side: ${product_id}_${color}_${storage}
  product_id: string;
  title: string;
  price: string;
  imageSrc: string;
  quantity: number;
  color: string;
  storage: string;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (
    productId: string,
    quantity: number,
    color: string,
    storage: string,
    title: string,
    price: string,
    imageSrc: string
  ) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const mapBackendItems = (items: any[]): CartItem[] => {
    return items.map((item) => ({
      id: `${item.product_id}_${item.color}_${item.storage}`,
      product_id: item.product_id,
      title: item.title,
      price: item.price,
      imageSrc: item.imageSrc,
      quantity: item.quantity,
      color: item.color,
      storage: item.storage,
    }));
  };

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/cart/");
      setCartItems(mapBackendItems(res.data.items || []));
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (
    productId: string,
    quantity: number,
    color: string,
    storage: string,
    title: string,
    price: string,
    imageSrc: string
  ) => {
    if (!user) {
      throw new Error("unauthenticated");
    }
    try {
      const res = await api.post("/cart/add", {
        product_id: productId,
        title,
        price,
        imageSrc,
        color,
        storage,
        quantity,
      });
      setCartItems(mapBackendItems(res.data.items || []));
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await api.put("/cart/update", {
        product_id: item.product_id,
        color: item.color,
        storage: item.storage,
        quantity: newQty,
      });
      setCartItems(mapBackendItems(res.data.items || []));
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const removeItem = async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      const res = await api.post("/cart/remove", {
        product_id: item.product_id,
        color: item.color,
        storage: item.storage,
      });
      setCartItems(mapBackendItems(res.data.items || []));
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete("/cart/clear");
      setCartItems(mapBackendItems(res.data.items || []));
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
