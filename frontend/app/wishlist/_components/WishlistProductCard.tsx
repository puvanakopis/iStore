"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

interface WishlistProductCardProps {
  id: number | string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  rating?: number;
  onRemove?: () => void;
  onAddToCart?: () => void;
}

export default function WishlistProductCard({
  id,
  title,
  price,
  imageSrc,
  imageAlt,
  rating = 4.8,
  onRemove,
  onAddToCart,
}: WishlistProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="group bg-white rounded-sm border border-border p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Product Image Area */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-black/5 rounded-sm flex-shrink-0 flex items-center justify-center p-4">
          <Link href={`/products/${id}`} className="block w-full h-full relative">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={`object-contain transition-transform duration-700 ease-[0.16, 1, 0.3, 1] ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row justify-between w-full md:w-auto gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <StarRating rating={rating} />
              <span className="text-[12px] text-foreground-muted font-medium">
                (4.8)
              </span>
            </div>

            <Link href={`/products/${id}`}>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>

            <p className="text-sm text-foreground-secondary font-light line-clamp-2 max-w-md">
              Experience the peak of performance and design with the {title}. A must-have for the ecosystem.
            </p>

            <div className="pt-2">
              <span className="text-lg font-bold text-gray-900">
                {price}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col justify-end md:justify-center gap-3">
            
            {/* FIXED BUTTON 👇 */}
            <button
              onClick={onAddToCart}
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-[1.05] active:scale-[0.95] transition-all min-w-[140px] whitespace-nowrap"
            >
              <ShoppingCart size={16} />
              <span className="whitespace-nowrap">Add to Cart</span>
            </button>

            <button
              onClick={onRemove}
              className="flex items-center justify-center gap-2 border border-border text-foreground-secondary px-8 py-3 rounded-full text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            >
              <X size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}