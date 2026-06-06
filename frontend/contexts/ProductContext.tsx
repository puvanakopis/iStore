"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductCreate, ProductUpdate } from "../interfaces/product.interface";
import { productService } from "../services/product.service";
import { useAuth } from "./AuthContext";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;

  createProduct: (data: ProductCreate) => Promise<void>;
  updateProduct: (id: string, data: ProductUpdate) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  canModifyProducts: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const canModifyProducts = isAdmin;

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: string) => {
    try {
      return await productService.getById(id);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      return null;
    }
  };

  const createProduct = async (data: ProductCreate) => {
    if (!canModifyProducts) {
      throw new Error("Admin access required to create products");
    }

    try {
      const newProduct = await productService.create(data);
      setProducts((prev) => [newProduct, ...prev]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      throw err;
    }
  };

  const updateProduct = async (id: string, data: ProductUpdate) => {
    if (!canModifyProducts) {
      throw new Error("Admin access required to update products");
    }

    try {
      const updated = await productService.update(id, data);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!canModifyProducts) {
      throw new Error("Admin access required to delete products");
    }

    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        canModifyProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};