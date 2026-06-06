"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { WishlistItem } from "../interfaces/wishlist.interface";
import { wishlistService } from "../services/wishlist.service";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistService.get();
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) throw new Error("unauthenticated");
    try {
      const data = await wishlistService.add(item);
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const data = await wishlistService.remove(productId);
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;
    try {
      const data = await wishlistService.clear();
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (item: WishlistItem) => {
    if (!user) throw new Error("unauthenticated");
    if (isInWishlist(item.product_id)) {
      await removeFromWishlist(item.product_id);
    } else {
      await addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
