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
  imageAlt?: string;
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
      : initialImages && initialImages.length > 0
      ? initialImages
      : ["/iPhone_01.png"];

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
    const color =
      fullProduct?.colors?.[selectedColorIndex]?.name ||
      colors?.[selectedColorIndex]?.name ||
      "Default";
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
      className="group relative w-full bg-[#fbfbfd] rounded-3xl p-5 transition-all duration-500 border border-gray-200/80 hover:border-gray-300 cursor-pointer flex flex-col h-full justify-between"
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
              className={`w-full h-full object-contain transition-all duration-700 ${
                isHovered ? "scale-108 -translate-y-1 " : "scale-100 translate-y-0"
              }`}
            />
          </Link>

          {/* Badge Tag */}
          {badge && (
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Save Amount */}
          {saveAmount && (
            <div className="absolute top-3.5 right-12 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                Save {saveAmount}
              </span>
            </div>
          )}

          {/* Wishlist Toggle Button */}
          <button
            aria-label="Add to wishlist"
            className={`absolute top-3.5 right-3.5 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full transition-all duration-300 shadow-sm border border-black/5 ${
              inWishlist
                ? "text-red-500 bg-white"
                : "text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleWishlistClick();
            }}
          >
            <Heart
              size={16}
              fill={inWishlist ? "currentColor" : "none"}
              className={`transition-transform duration-300 ${
                isHovered || inWishlist ? "scale-110" : ""
              }`}
            />
          </button>

          {/* Quick View Details Overlay Pill */}
          <div
            className={`absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <Link href={`/products/${id}`}>
              <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 whitespace-nowrap">
                <Eye size={13} />
                <span>View Details</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Content & Details */}
        <div className="px-1 space-y-3">
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
            <h3 className="text-[18px] font-bold text-black group-hover:text-black/80 transition-colors line-clamp-1 tracking-tight">
              {title}
            </h3>
          </Link>

          {/* Subtitle */}
          <p className="text-foreground-secondary text-[13px] font-light tracking-tight">
            Experience the extraordinary.
          </p>

          {/* Color Swatches */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider">
                Colors
              </span>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={(e) => selectColor(e, index)}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      selectedColorIndex === index
                        ? "ring-2 ring-offset-2 ring-black scale-110"
                        : "ring-1 ring-gray-200 hover:scale-110"
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

      {/* Pricing & Checkout Footer */}
      <div className="px-1 pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider">
            {oldPrice ? "Limited Offer" : "From"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-black tracking-tight">
              {price}
            </span>
            {oldPrice && (
              <span className="text-[13px] text-gray-400 line-through font-light">
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
          aria-label="Buy now"
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:bg-gray-800"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </motion.div>
  );
}