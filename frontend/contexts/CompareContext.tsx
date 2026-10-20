"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../interfaces/product.interface";

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (id: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  maxCompareLimit: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_LIMIT = 4;
const STORAGE_KEY = "istore_compare_items";

export const CompareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareList(parsed.slice(0, MAX_COMPARE_LIMIT));
        }
      }
    } catch (e) {
      console.error("Failed to load compare items from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
      } catch (e) {
        console.error("Failed to save compare items to localStorage:", e);
      }
    }
  }, [compareList, isInitialized]);

  const isInCompare = (id: string) => {
    return compareList.some((p) => p.id === id);
  };

  const addToCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      return false;
    }
    if (compareList.length >= MAX_COMPARE_LIMIT) {
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        maxCompareLimit: MAX_COMPARE_LIMIT,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
