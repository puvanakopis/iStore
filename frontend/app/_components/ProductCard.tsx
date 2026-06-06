"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

interface ProductCardProps {
  id: number | string;
  title: string;
  price: string;
  oldPrice?: string;
  saveAmount?: string;
  images: string[];
  imageAlt: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  colors?: {
    name: string;
    hex: string;
    images: string[];
  }[];
}

export default function ProductCard({
  id,
  title,
  price,
  oldPrice,
  saveAmount,
  images: initialImages,
  imageAlt,
  badge,
  rating,
  reviewCount,
  colors,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentImages =
    colors && colors.length > 0
      ? colors[selectedColorIndex].images
      : (initialImages && initialImages.length > 0 ? initialImages : ["/product/iPhone_16_Pro_Max_01.png"]);

  const selectColor = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedColorIndex(index);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((p) => (p + 1) % currentImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (p) => (p - 1 + currentImages.length) % currentImages.length
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group relative w-full bg-white rounded-sm p-4 transition-all duration-500 border border-border cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden mb-6">
        <Link
          href={`/products/${id}`}
          className="block w-full h-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`relative w-full h-full transition-all duration-700 ${isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0"
                }`}
            >
              <Image
                src={currentImages[currentImageIndex]}
                alt={imageAlt}
                fill
                className="object-contain p-8"
              />
            </motion.div>
          </AnimatePresence>
        </Link>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg shadow-black-200">
              {badge}
            </span>
          </div>
        )}

        {/* Save */}
        {saveAmount && (
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[11px] font-medium uppercase tracking-wide bg-green-50 text-green-700 px-3 py-1 rounded-full">
              Save {saveAmount}
            </span>
          </div>
        )}

        {/* Favorite Icon */}
        <button
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart
            size={18}
            fill={isHovered ? "currentColor" : "none"}
            className={isHovered ? "scale-110" : ""}
          />
        </button>

        {/* View Details Overlay (UPDATED) */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xl hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2">
            <Eye size={14} /> View Details
          </button>
        </div>

        {/* Image Controls */}
        {currentImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 pointer-events-none">
            <button
              onClick={prevImage}
              className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-auto"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-auto"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-2 space-y-4">
        {/* Rating */}
        {rating && reviewCount !== undefined && (
          <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            <span className="text-[12px] text-foreground-muted font-medium">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${id}`}>
          <h3 className="text-[20px] font-bold text-gray-900 mb-1 group-hover:text-black-600 transition-colors line-clamp-1 tracking-tight">
            {title}
          </h3>
        </Link>

        {/* Subtitle */}
        <p className="text-foreground-secondary text-sm font-light tracking-tight pb-2">
          Experience the extraordinary.
        </p>

        {/* Colors */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">
              Colors
            </span>
            <div className="flex gap-2.5">
              {colors.map((color, index) => (
                <button
                  key={color.name}
                  onClick={(e) => selectColor(e, index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${selectedColorIndex === index
                    ? "ring-2 ring-offset-2 ring-black scale-110"
                    : "ring-1 ring-gray-200 hover:scale-105"
                    }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">
              {oldPrice ? "Limited Offer" : "Starting At"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tighter">
                {price}
              </span>
              {oldPrice && (
                <span className="text-[14px] text-gray-400 line-through font-light">
                  {oldPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}