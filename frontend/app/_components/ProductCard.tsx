"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number | string;
  title: string;
  price: string;
  oldPrice?: string;
  saveAmount?: string;
  images: string[];
  imageSrc?: string;
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
  imageSrc,
  imageAlt,
  badge,
  rating,
  reviewCount,
  colors,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { startCheckout } = useCheckout();
  const { products } = useProducts();
  const { user } = useAuth();
  const router = useRouter();

  const inWishlist = isInWishlist(id.toString());

  const currentImages =
    colors && colors.length > 0
      ? colors[selectedColorIndex].images
      : (initialImages && initialImages.length > 0 ? initialImages : ["/product/iPhone_16_Pro_Max_01.png"]);

  const displayImage = imageSrc || currentImages[0];

  const selectColor = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedColorIndex(index);
  };

  const handleWishlistClick = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    try {
      await toggleWishlist({
        product_id: id.toString(),
        title,
        price,
        imageSrc: displayImage,
        imageAlt: imageAlt || title,
      });
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    const fullProduct = products.find((p) => p.id === id.toString());
    const color = fullProduct?.colors?.[selectedColorIndex]?.name || colors?.[selectedColorIndex]?.name || "Default";
    const storage = fullProduct?.storage?.[0]?.size || "Base";
    const currentPrice = fullProduct?.storage?.[0]?.price || price;

    startCheckout({
      product_id: id.toString(),
      quantity: 1,
      color,
      storage,
      title,
      price: currentPrice,
      imageSrc: displayImage,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group relative w-full bg-white rounded-sm p-4 transition-all duration-500 border border-border cursor-pointer flex flex-col h-full justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image Section */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden mb-6">
          <Link
            href={`/products/${id}`}
            className="block w-full h-full p-8"
          >
            <img
              src={displayImage}
              alt={imageAlt || title}
              className={`w-full h-full object-contain transition-all duration-700 ${isHovered
                  ? "scale-110 rotate-2"
                  : "scale-100 rotate-0"
                }`}
            />
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
            <div className="absolute top-4 right-14 z-10">
              <span className="text-[11px] font-medium uppercase tracking-wide bg-green-50 text-green-700 px-3 py-1 rounded-full">
                Save {saveAmount}
              </span>
            </div>
          )}

          {/* Favorite Icon */}
          <button
            className={`absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full transition-all duration-300 shadow-sm ${
              inWishlist ? "text-red-500 hover:bg-white" : "text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleWishlistClick();
            }}
          >
            <Heart
              size={18}
              fill={inWishlist ? "currentColor" : (isHovered ? "currentColor" : "none")}
              className={isHovered || inWishlist ? "scale-110" : ""}
            />
          </button>

          {/* View Details Overlay */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xl hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2">
              <Eye size={14} /> View Details
            </button>
          </div>
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
        </div>
      </div>

      {/* Price */}
      <div className="px-2 pt-4 flex items-center justify-between">
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

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCheckoutClick();
          }}
          className="w-10 h-10 bg-white border border-border text-gray-900 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group/btn overflow-hidden relative shadow-sm"
        >
          <ShoppingCart
            size={18}
            className="group-hover/btn:rotate-12 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
}