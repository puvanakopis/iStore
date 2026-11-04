"use client";

import ShopProductCard from "./ShopProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { PackageX } from "lucide-react";

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

interface Product {
  id: number | string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  subtitle?: string;
  colors?: ProductColor[];
}

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export default function ProductGrid({ products, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#f7f7f7] rounded-[28px] border border-black/[0.04] p-12 md:p-16 flex flex-col items-center justify-center text-center my-6"
      >
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xs transition-transform duration-500 hover:scale-105">
          <PackageX size={36} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-3 tracking-tight">
          No matching products
        </h3>
        <p className="text-[15px] text-gray-500 font-normal max-w-sm mx-auto mb-6 leading-relaxed">
          We could not find any models matching your selected filters. Try adjusting or clearing filters to view more products.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
            className="h-full"
          >
            <ShopProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              rating={product.rating}
              reviewCount={product.reviewCount}
              isNew={product.isNew}
              subtitle={product.subtitle}
              colors={product.colors}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
