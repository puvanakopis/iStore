"use client";

import { useMemo, useState } from "react";
import ProductGrid from "./_components/ProductGrid";
import FilterSidebar from "./_components/FilterSidebar";
import { SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/contexts/ProductContext";

export type FilterState = {
  models: string[];
  colors: string[];
  storage: string[];
  priceRange: [number, number];
};

const QUICK_FILTERS = [
  { label: "All Models", value: "" },
  { label: "iPhone 16 Series", value: "iPhone 16" },
  { label: "iPhone 15 Series", value: "iPhone 15" },
  { label: "iPhone 14 Series", value: "iPhone 14" },
  { label: "iPhone 13 Series", value: "iPhone 13" },
];

export default function Shop() {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState<FilterState>({
    models: [],
    colors: [],
    storage: [],
    priceRange: [0, 1000000],
  });

  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleQuickFilter = (modelPrefix: string) => {
    setActiveQuickFilter(modelPrefix);
    if (!modelPrefix) {
      setFilters((prev) => ({ ...prev, models: [] }));
    } else {
      setFilters((prev) => ({ ...prev, models: [modelPrefix] }));
    }
  };

  const resetAllFilters = () => {
    setActiveQuickFilter("");
    setFilters({
      models: [],
      colors: [],
      storage: [],
      priceRange: [0, 1000000],
    });
  };

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

  const activeFilterCount =
    filters.models.length +
    filters.storage.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000 ? 1 : 0);

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
      {/* Page Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#f7f7f7] text-gray-800 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-black/[0.04]">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            iStore Official Lineup
          </div>

          <h1 className="text-[36px] sm:text-[46px] md:text-[56px] font-extrabold tracking-tight text-gray-900 leading-[1.08]">
            Experience the <br className="hidden sm:inline" /> Future of Technology.
          </h1>

          <p className="text-gray-500 text-base md:text-lg font-normal max-w-2xl leading-relaxed">
            Discover our complete lineup of flagship smartphones, engineered with industry-leading precision and Apple Intelligence.
          </p>
        </motion.div>

        {/* Quick Filter Navigation Pills (Samsung Dot-Com Style) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pt-8 pb-2 no-scrollbar">
          {QUICK_FILTERS.map((item) => {
            const isSelected = activeQuickFilter === item.value;
            return (
              <button
                key={item.label}
                onClick={() => handleQuickFilter(item.value)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "bg-[#f7f7f7] text-gray-700 hover:bg-gray-200/80 border border-black/[0.03]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* Mobile Filter Toggle & Sort */}
          <div className="w-full flex lg:hidden justify-between items-center pb-4 border-b border-black/[0.05] mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-gray-900 px-4 py-2.5 bg-[#f7f7f7] border border-black/[0.04] rounded-full transition-all active:scale-95 shadow-2xs"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#f7f7f7] border border-black/[0.04] text-xs font-semibold px-4 py-2.5 pr-8 rounded-full outline-none cursor-pointer tracking-tight text-gray-900"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
              />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Main Grid Content */}
          <div className="flex-grow w-full">
            {/* Desktop Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-black/[0.05]">
              <div className="flex items-center gap-3">
                <p className="text-gray-500 text-sm font-normal tracking-tight">
                  Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> models
                </p>

                {activeFilterCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-semibold bg-[#f7f7f7] px-3 py-1 rounded-full border border-black/[0.04] transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-[#f7f7f7] border border-black/[0.04] text-gray-900 font-semibold tracking-tight rounded-full px-5 py-2.5 pr-10 text-xs md:text-sm cursor-pointer transition-all hover:bg-gray-200/70 focus:outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Sort by: Price (Low to High)</option>
                  <option value="price-high">Sort by: Price (High to Low)</option>
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-24 bg-[#f7f7f7] rounded-[28px] border border-black/[0.04]">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-4 text-xs font-semibold uppercase tracking-wider">
                  Loading lineup...
                </p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onResetFilters={resetAllFilters}
              />
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
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-[110] shadow-2xl lg:hidden overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-black/[0.05] flex justify-between items-center bg-[#f7f7f7] sticky top-0 z-10">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-700 hover:text-black shadow-2xs active:scale-95 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 pb-28 flex-grow">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>

              <div className="fixed bottom-0 right-0 w-full max-w-sm p-5 bg-white/95 backdrop-blur-md border-t border-black/[0.05]">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-full shadow-md active:scale-98 transition-all text-sm"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
