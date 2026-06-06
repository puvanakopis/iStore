"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../interfaces/product.interface";
import { productService } from "../services/product.service";

interface ProductContextType {
  products: Product[];
  loading: boolean;

  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;

  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: string) => {
    return await productService.getById(id);
  };

  const createProduct = async (data: any) => {
    const newProduct = await productService.create(data);
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = async (id: string, data: any) => {
    const updated = await productService.update(id, data);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  };

  const deleteProduct = async (id: string) => {
    await productService.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
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