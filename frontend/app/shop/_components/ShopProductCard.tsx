"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ShopProductCardProps {
  id: number | string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export default function ShopProductCard({
  id,
  title,
  price,
  imageSrc,
  imageAlt,
  rating = 4.5,
  reviewCount = 120,
  isNew = false,
  onAddToCart,
  onToggleWishlist,
}: ShopProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();
  const router = useRouter();

  const inWishlist = isInWishlist(id.toString());

  const handleWishlistClick = async () => {
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
        imageSrc,
        imageAlt: imageAlt || title,
      });
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleAddToCartClick = async () => {
    if (onAddToCart) {
      onAddToCart();
      return;
    }
    if (!user) {
      router.push("/signin");
      return;
    }
    const fullProduct = products.find((p) => p.id === id.toString());
    const color = fullProduct?.colors?.[0]?.name || "Default";
    const storage = fullProduct?.storage?.[0]?.size || "Base";
    const currentPrice = fullProduct?.storage?.[0]?.price || price;

    try {
      await addToCart(
        id.toString(),
        1,
        color,
        storage,
        title,
        currentPrice,
        imageSrc
      );
      router.push("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <motion.div
      className="group bg-white rounded-sm p-4 transition-all duration-500 border border-border flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-6">
        {isNew && (
          <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter">
            Latest
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            handleWishlistClick();
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full transition-all duration-300 ${
            inWishlist ? "text-red-500 hover:bg-white" : "text-gray-400 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart
            size={18}
            fill={inWishlist ? "currentColor" : (isHovered ? "currentColor" : "none")}
            className={isHovered || inWishlist ? "scale-110" : ""}
          />
        </button>

        <Link
          href={`/products/${id}`}
          className="block w-full h-full p-8"
        >
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className={`object-contain p-8 transition-all duration-700 ${isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0"
              }`}
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          <button className="bg-white text-gray-900 px-5 py-3 rounded-xl text-xs font-bold hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
            <Eye size={14} />
            Quick View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-2 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating} />
          <span className="text-[12px] text-foreground-muted font-medium">
            ({reviewCount})
          </span>
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="text-[20px] font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
            {title}
          </h3>
        </Link>

        <p className="text-foreground-secondary text-sm mb-5 font-light tracking-tight">
          Apple Intelligence
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">
              Starting At
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tighter">
              {price}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCartClick();
            }}
            className="w-10 h-10 bg-white border border-border text-gray-900 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group/btn overflow-hidden relative shadow-sm"
          >
            <ShoppingCart
              size={18}
              className="group-hover/btn:rotate-12 transition-transform"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}