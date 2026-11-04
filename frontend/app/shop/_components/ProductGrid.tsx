"use client";

import ShopProductCard from "./ShopProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { PackageX } from "lucide-react";

interface Product {
  id: number | string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center justify-center py-40 text-center"
      >
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 transition-transform duration-500 hover:scale-110">
          <PackageX size={44} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-[24px] md:text-[32px] font-bold text-gray-900 mb-4 tracking-tight">No products found</h3>
        <p className="text-[17px] md:text-[19px] text-foreground-secondary font-light max-w-sm mx-auto tracking-tight leading-relaxed">
          We could not find any products matching your current filters. Try adjusting them to see more of our collection.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

