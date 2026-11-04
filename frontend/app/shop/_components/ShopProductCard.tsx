"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, Layers, Check } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useProducts } from "@/contexts/ProductContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { resolveImageSrc } from "@/utils/image";

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

interface ShopProductCardProps {
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
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export default function ShopProductCard({
  id,
  title,
  price,
  imageSrc,
  imageAlt,
  rating = 4.8,
  reviewCount = 120,
  isNew = false,
  subtitle,
  colors,
  onAddToCart,
  onToggleWishlist,
}: ShopProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { startCheckout } = useCheckout();
  const { products } = useProducts();
  const { isInCompare, toggleCompare } = useCompare();
  const { user } = useAuth();
  const router = useRouter();

  const inWishlist = isInWishlist(id.toString());
  const inCompare = isInCompare(id.toString());

  // Determine current display image (supports color variant switching)
  const currentImages =
    colors && colors.length > 0 && colors[selectedColorIndex]?.images?.length > 0
      ? colors[selectedColorIndex].images
      : [imageSrc];
  const activeImage = resolveImageSrc(currentImages[0] || imageSrc);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullProduct = products.find((p) => p.id === id.toString());
    if (fullProduct) {
      toggleCompare(fullProduct);
    } else {
      toggleCompare({
        id: id.toString(),
        title,
        price,
        imageSrc: activeImage,
        imageAlt: imageAlt || title,
        colors: colors || [],
        storage: [],
        features: [],
        reviews: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist();
      return;
    }
    if (!user) {
      router.push("/signin");
      return;
    }
    try {
      await toggleWishlist({
        product_id: id.toString(),
        title,
        price,
        imageSrc: activeImage,
        imageAlt: imageAlt || title,
      });
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
      return;
    }
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
      imageSrc: activeImage,
    });
  };

  return (
    <motion.div
      className="group relative bg-[#f7f7f7] rounded-[24px] p-5 transition-all duration-300 border border-black/[0.04] hover:border-black/10 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col h-full justify-between overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between mb-2 z-10 relative">
          <div>
            {isNew && (
              <span className="inline-block bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Latest
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Compare Toggle */}
            <button
              onClick={handleCompareClick}
              title={inCompare ? "Remove from comparison" : "Add to comparison"}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs ${
                inCompare
                  ? "bg-black text-white scale-105"
                  : "bg-white/80 backdrop-blur-md text-gray-500 hover:text-black hover:bg-white"
              }`}
            >
              {inCompare ? <Check size={14} strokeWidth={2.5} /> : <Layers size={14} />}
            </button>

            {/* Wishlist Toggle */}
            <button
              onClick={handleWishlistClick}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xs ${
                inWishlist
                  ? "text-red-500 hover:bg-white"
                  : "text-gray-400 hover:text-red-500 hover:bg-white"
              }`}
            >
              <Heart
                size={16}
                fill={inWishlist ? "currentColor" : "none"}
                className={inWishlist ? "scale-110" : "transition-transform group-hover:scale-105"}
              />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <div className="relative aspect-square w-full rounded-[20px] flex items-center justify-center overflow-hidden mb-4 p-4">
          <Link
            href={`/products/${id}`}
            className="block w-full h-full flex items-center justify-center"
          >
            <img
              src={activeImage}
              alt={imageAlt || title}
              className={`max-w-full max-h-full object-contain transition-transform duration-700 ease-out drop-shadow-sm ${
                isHovered ? "scale-108 rotate-1" : "scale-100 rotate-0"
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/iPhone_01.png";
              }}
            />
          </Link>

          {/* Quick View Hover Pill */}
          <div
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <Link
              href={`/products/${id}`}
              className="pointer-events-auto bg-white/95 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-md hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </Link>
          </div>
        </div>

        {/* Color Swatches (if available) */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 px-1">
            {colors.slice(0, 5).map((color, index) => (
              <button
                key={color.name + index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColorIndex(index);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  selectedColorIndex === index
                    ? "ring-2 ring-offset-2 ring-black scale-110"
                    : "ring-1 ring-black/10 hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[10px] text-gray-400 font-medium ml-1">
                +{colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Product Information */}
        <div className="px-1 space-y-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRating rating={rating} />
            <span className="text-[11px] text-gray-500 font-medium">
              ({reviewCount})
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${id}`} className="block">
            <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1 tracking-tight">
              {title}
            </h3>
          </Link>

          {/* Subtitle / Eyebrow */}
          <p className="text-xs text-gray-500 font-normal line-clamp-1 pb-2">
            {subtitle || "Apple Intelligence & Titanium Design"}
          </p>
        </div>
      </div>

      {/* Pricing & CTA Bottom Row */}
      <div className="pt-4 px-1 border-t border-black/[0.04] flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
            Starting At
          </span>
          <span className="text-[20px] md:text-[22px] font-bold tracking-tight text-gray-900">
            {price}
          </span>
        </div>

        <button
          onClick={handleCheckoutClick}
          className="flex items-center gap-1.5 bg-black text-white hover:bg-gray-800 active:scale-95 px-4 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 group/btn"
          title="Buy Now"
        >
          <ShoppingCart
            size={14}
            className="group-hover/btn:rotate-6 transition-transform"
          />
          <span>Buy Now</span>
        </button>
      </div>
    </motion.div>
  );
}
