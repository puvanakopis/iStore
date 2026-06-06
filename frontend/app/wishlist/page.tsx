"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WishlistProductCard from "./_components/WishlistProductCard";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    // Find the full product details from Products context to retrieve color/storage defaults
    const fullProduct = products.find((p) => p.id === productId);
    const wishlistProduct = wishlistItems.find((item) => item.product_id === productId);

    if (!wishlistProduct) return;

    // Pick first color and storage from fullProduct, or fall back to defaults
    const color = fullProduct?.colors?.[0]?.name || "Default";
    const storage = fullProduct?.storage?.[0]?.size || "Base";
    const price = fullProduct?.storage?.[0]?.price || wishlistProduct.price;

    try {
      await addToCart(
        productId,
        1,
        color,
        storage,
        wishlistProduct.title,
        price,
        wishlistProduct.imageSrc
      );
      // Optional: remove from wishlist after adding to cart
      await removeFromWishlist(productId);
      router.push("/cart");
    } catch (err) {
      console.error("Failed to add wishlist item to cart:", err);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight mb-2">My Wishlist</h1>
            <p className="text-foreground-secondary font-light">Your curated collection of must-have Apple gear.</p>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1">
            {wishlistLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-4 text-sm font-medium">Loading wishlist...</p>
              </div>
            ) : wishlistItems.length > 0 ? (
              <div className="space-y-6">
                {wishlistItems.map((item) => (
                  <WishlistProductCard
                    key={item.product_id}
                    id={item.product_id}
                    title={item.title}
                    price={item.price}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt || item.title}
                    onRemove={() => removeFromWishlist(item.product_id)}
                    onAddToCart={() => handleAddToCart(item.product_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-sm">
                <Heart size={48} className="text-foreground-muted mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-foreground-secondary font-light mb-8">Items you save will appear here.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all">
                  Go Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
