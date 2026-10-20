"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/contexts/CompareContext";
import { usePathname, useRouter } from "next/navigation";
import { X, ArrowRight, Layers, Trash2 } from "lucide-react";
import Link from "next/link";

export default function FloatingCompareBar() {
  const { compareList, removeFromCompare, clearCompare, maxCompareLimit } = useCompare();
  const pathname = usePathname();
  const router = useRouter();

  // Hide the bar if on the compare page or if no products are in compare list
  if (pathname === "/compare" || compareList.length === 0) {
    return null;
  }

  const emptySlotsCount = Math.max(0, Math.min(2, maxCompareLimit) - compareList.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl"
      >
        <div className="bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl rounded-3xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Header & Product Thumbnails */}
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto w-full md:w-auto py-1 px-1 scrollbar-none">
            <div className="flex items-center gap-2 pl-2 pr-2 border-r border-black/10 text-xs font-semibold text-black/70 whitespace-nowrap">
              <Layers size={16} className="text-black" />
              <span>Compare ({compareList.length}/{maxCompareLimit})</span>
            </div>

            <div className="flex items-center gap-3">
              {compareList.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative flex items-center gap-2.5 bg-black/[0.04] hover:bg-black/[0.07] border border-black/5 rounded-2xl py-1.5 px-3 pr-2 transition-all group shrink-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-white overflow-hidden p-1 flex items-center justify-center shrink-0 border border-black/5">
                    <img
                      src={product.imageSrc}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col max-w-[110px] md:max-w-[130px]">
                    <span className="text-xs font-semibold text-black truncate leading-tight">
                      {product.title}
                    </span>
                    <span className="text-[10px] text-black/50 font-medium truncate">
                      {product.price}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="p-1 text-black/40 hover:text-red-500 hover:bg-black/5 rounded-full transition-colors ml-1"
                    title="Remove from comparison"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}

              {/* Ghost slots prompt */}
              {Array.from({ length: emptySlotsCount }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="hidden sm:flex items-center justify-center border border-dashed border-black/20 rounded-2xl px-4 py-2 text-[11px] text-black/40 shrink-0 font-medium"
                >
                  + Add device
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            <button
              onClick={clearCompare}
              className="p-2.5 text-black/40 hover:text-black hover:bg-black/5 rounded-2xl text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Clear all"
            >
              <Trash2 size={15} />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={() => router.push("/compare")}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-black text-white hover:bg-black/80 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>Compare Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
