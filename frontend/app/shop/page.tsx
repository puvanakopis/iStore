"use client";

import { useMemo, useState } from "react";
import ProductGrid from "./_components/ProductGrid";
import FilterSidebar from "./_components/FilterSidebar";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/contexts/ProductContext";

export type FilterState = {
  models: string[];
  colors: string[];
  storage: string[];
  priceRange: [number, number];
};

export default function Shop() {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState<FilterState>({
    models: [],
    colors: [],
    storage: [],
    priceRange: [0, 1000000],
  });

  const [sortBy, setSortBy] = useState("featured");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Model
    if (filters.models.length > 0) {
      result = result.filter((p) =>
        filters.models.some((m) => p.title.toLowerCase().includes(m.toLowerCase()))
      );
    }

    // Filter by Color
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors?.some((c) => filters.colors.includes(c.name))
      );
    }

    // Filter by Storage
    if (filters.storage.length > 0) {
      result = result.filter((p) =>
        p.storage?.some((s) => filters.storage.includes(s.size))
      );
    }

    // Filter by Price
    result = result.filter((p) => {
      if (!p.price) return false;
      const price = parseInt(p.price.replace(/[^\d]/g, "")) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sort Logic
    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const priceA = parseInt((a.price || "").replace(/[^\d]/g, "")) || 0;
        const priceB = parseInt((b.price || "").replace(/[^\d]/g, "")) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const priceA = parseInt((a.price || "").replace(/[^\d]/g, "")) || 0;
        const priceB = parseInt((b.price || "").replace(/[^\d]/g, "")) || 0;
        return priceB - priceA;
      });
    }

    return result;
  }, [products, filters, sortBy]);

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-black-600 font-bold uppercase tracking-[0.2em] text-[12px] mb-4 block">
            iStore Shop
          </span>
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Experience the <br className="hidden md:block" /> Future of Technology.
          </h1>
          <p className="text-foreground-secondary text-lg md:text-xl font-light max-w-2xl tracking-tight leading-relaxed">
            Discover our full range of iPhone models, accessorized for your lifestyle.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Mobile Filter Toggle & Sort */}
          <div className="w-full flex lg:hidden justify-between items-center pb-6 border-b border-gray-100 mb-6 px-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-bold text-black-600 px-5 py-2.5 bg-black-50 rounded-xl transition-all active:scale-95 shadow-sm shadow-black-100"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent text-sm font-bold pr-8 outline-none cursor-pointer tracking-tight text-gray-900"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Main Grid Content */}
          <div className="flex-grow w-full">
            {/* Desktop Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
              <p className="text-foreground-secondary font-light tracking-tight">
                Showing <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> results
              </p>

              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
      w-full appearance-none
      bg-white
      border border-gray-200
      text-gray-900
      font-medium
      tracking-tight
      rounded-xl
      px-5 py-3 pr-10
      text-sm
      cursor-pointer
      transition-all

      hover:border-gray-300
      focus:outline-none
      focus:ring-2 focus:ring-gray-200
      focus:border-gray-300
    "
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <ChevronDown
                  size={16}
                  className="
      absolute right-4 top-1/2 -translate-y-1/2
      text-gray-400 pointer-events-none
    "
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-4 text-sm font-medium">Loading products...</p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </section>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 w-full max-w-xs h-full bg-white z-[110] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold tracking-tight">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all hover:bg-gray-100 active:scale-90"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 pb-24">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>

              <div className="fixed bottom-0 right-0 w-full max-w-xs p-6 bg-white border-t border-gray-100 md:hidden">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full bg-black-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-black-200"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}