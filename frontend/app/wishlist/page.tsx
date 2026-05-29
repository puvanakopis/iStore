"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WishlistProductCard from "./_components/WishlistProductCard";
import { products } from "@/data/productData";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  // Simulating wishlist with first 3 products
  const wishlistProducts = products.slice(0, 3);

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
            {wishlistProducts.length > 0 ? (
              <div className="space-y-6">
                {wishlistProducts.map((product) => (
                  <WishlistProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageSrc={product.imageSrc}
                    imageAlt={product.imageAlt}
                    onRemove={() => console.log("Remove", product.id)}
                    onAddToCart={() => console.log("Add to Cart", product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-sm">
                <Heart size={48} className="text-foreground-muted mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-foreground-secondary font-light mb-8">Items you save will appear here.</p>
                <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all">
                  Go Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
