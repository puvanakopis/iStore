"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { resolveImageSrc } from "@/utils/image";

interface WishlistProductCardProps {
  id: number | string;
  title: string;
  price: string | number;
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

  const resolvedImageSrc = resolveImageSrc(imageSrc);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="group bg-white rounded-sm border border-border p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-black/5 rounded-sm flex-shrink-0">
          <Link
            href={`/products/${id}`}
            className="block w-full h-full relative"
          >
            <Image
              src={resolvedImageSrc}
              alt={imageAlt}
              fill
              unoptimized
              className={`object-contain transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
                }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/iPhone_01.png";
              }}
            />
          </Link>
        </div>

        <div className="flex-1 flex flex-col md:flex-row justify-between gap-6 w-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={rating} />
              <span className="text-xs text-gray-500">(4.8)</span>
            </div>

            <Link href={`/products/${id}`}>
              <h3 className="text-xl font-bold hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>

            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              Experience the peak of performance and design with the {title}.
            </p>

            <div className="mt-4">
              <span className="text-lg font-bold">
                {typeof price === "number"
                  ? `Rs. ${price.toLocaleString()}`
                  : price}
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 justify-center">
            <button
              onClick={onAddToCart}
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-105 transition-all"
            >
              <ShoppingCart size={16} />
              Checkout
            </button>

            <button
              onClick={onRemove}
              className="flex items-center justify-center gap-2 border border-border px-8 py-3 rounded-full text-sm font-bold hover:bg-red-50 hover:text-red-600"
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