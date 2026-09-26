"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  X,
  Plus,
  Check,
  Sparkles,
  Cpu,
  Tv,
  Camera,
  BatteryCharging,
  Smartphone,
  Shield,
  Layers,
  ArrowRight,
  ShoppingBag,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { useProducts } from "@/contexts/ProductContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product.interface";

export default function ComparePage() {
  const { compareList, removeFromCompare, addToCompare, clearCompare, maxCompareLimit } = useCompare();
  const { products, loading } = useProducts();
  const { startCheckout } = useCheckout();
  const { user } = useAuth();
  const router = useRouter();

  // Highlight differences toggle
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Selected color index per product id
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, number>>({});

  // Active product selector dropdown for a specific slot index
  const [activePickerSlot, setActivePickerSlot] = useState<number | null>(null);
  const [pickerSearchQuery, setPickerSearchQuery] = useState("");

  // Storage selection per product id
  const [selectedStorageMap, setSelectedStorageMap] = useState<Record<string, string>>({});

  // Helper to get formatted specs for comparison
  const getProductSpecs = (product: Product) => {
    const specs = product.specifications || {};

    const displaySize =
      typeof specs.display === "object"
        ? specs.display?.size
        : typeof specs.display === "string"
        ? specs.display
        : "";

    const displayType =
      typeof specs.display === "object"
        ? specs.display?.type
        : "";

    const displayResolution =
      typeof specs.display === "object"
        ? specs.display?.resolution
        : "";

    const chip =
      specs.platform?.chip ||
      specs.chip ||
      product.features?.find((f) => f.title.toLowerCase().includes("chip"))?.title ||
      "Apple Silicon";

    const os = specs.platform?.os || "iOS";

    const mainCamera =
      specs.main_camera?.megapixels ||
      specs.mainCamera?.megapixels ||
      specs.camera ||
      "Advanced Dual/Triple Camera System";

    const mainCameraType =
      specs.main_camera?.type ||
      specs.mainCamera?.type ||
      "Pro Camera System";

    const mainCameraVideo =
      specs.main_camera?.video ||
      specs.mainCamera?.video ||
      "4K Dolby Vision HDR recording";

    const selfieCamera =
      specs.selfie_camera?.megapixels ||
      specs.selfieCamera?.megapixels ||
      "12MP TrueDepth front camera";

    const selfieCameraVideo =
      specs.selfie_camera?.video ||
      specs.selfieCamera?.video ||
      "4K Dolby Vision recording";

    const batteryType =
      typeof specs.battery === "object"
        ? specs.battery?.type
        : typeof specs.battery === "string"
        ? specs.battery
        : "Built-in rechargeable lithium-ion battery";

    const charging =
      typeof specs.battery === "object"
        ? specs.battery?.charging
        : "Fast-charge capable / MagSafe wireless";

    const dimensions = specs.body?.dimensions || "Compact & ergonomic";
    const weight = specs.body?.weight || "Lightweight design";
    const build = specs.body?.build || specs.finish || "Aerospace-grade Aluminum / Titanium";

    const colorsList = product.colors?.map((c) => c.name).join(", ") || specs.finish || "Multiple finishes";
    const storageList = product.storage?.map((s) => s.size).join(", ") || specs.capacity || "128GB, 256GB, 512GB";

    return {
      displaySize: displaySize || "6.1-inch / 6.7-inch Super Retina XDR",
      displayType: displayType || "OLED with True Tone",
      displayResolution: displayResolution || "High-density Super Retina",
      chip,
      os,
      mainCamera,
      mainCameraType,
      mainCameraVideo,
      selfieCamera,
      selfieCameraVideo,
      batteryType,
      charging,
      dimensions,
      weight,
      build,
      colorsList,
      storageList,
    };
  };

  // Helper to check if row values differ among compared products
  const isRowDifferent = (getter: (p: Product) => string | undefined) => {
    if (compareList.length < 2) return false;
    const firstVal = getter(compareList[0]);
    return compareList.some((p) => getter(p) !== firstVal);
  };

  const handleSelectDeviceForSlot = (product: Product, slotIndex: number) => {
    // If replacing existing or filling new
    if (slotIndex < compareList.length) {
      // Replace
      const updated = [...compareList];
      updated[slotIndex] = product;
      // Filter out duplicate if product already was in list elsewhere
      const deduped = updated.filter(
        (p, idx) => idx === slotIndex || p.id !== product.id
      );
      clearCompare();
      deduped.forEach((p) => addToCompare(p));
    } else {
      addToCompare(product);
    }
    setActivePickerSlot(null);
    setPickerSearchQuery("");
  };

  const handleCheckoutProduct = (product: Product) => {
    if (!user) {
      router.push("/signin");
      return;
    }
    const colorIdx = selectedColorMap[product.id] || 0;
    const activeColor = product.colors?.[colorIdx]?.name || "Default";
    const activeStorage = selectedStorageMap[product.id] || product.storage?.[0]?.size || "Base";
    const currentPrice =
      product.storage?.find((s) => s.size === activeStorage)?.price || product.price;

    const colorObj = product.colors?.[colorIdx];
    const imageSrc =
      colorObj?.images && colorObj.images.length > 0
        ? colorObj.images[0]
        : product.imageSrc;

    startCheckout({
      product_id: product.id,
      quantity: 1,
      color: activeColor,
      storage: activeStorage,
      title: product.title,
      price: currentPrice,
      imageSrc,
    });
  };

  const filteredPickerProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(pickerSearchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(pickerSearchQuery.toLowerCase()));
      const alreadyAdded = compareList.some((item) => item.id === p.id);
      return matchQuery && !alreadyAdded;
    });
  }, [products, pickerSearchQuery, compareList]);

  // Quick preset loader (e.g. load first 2-3 products)
  const handleLoadPresets = () => {
    clearCompare();
    products.slice(0, 3).forEach((p) => addToCompare(p));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-32">
      {/* Breadcrumb & Top Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Compare Models</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black/5 text-black text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} />
                Specification Matrix
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black leading-tight">
              Compare iPhone Models.
            </h1>
            <p className="text-black/60 text-base md:text-lg font-light mt-2 max-w-xl">
              Get side-by-side technical breakdowns of display, silicon, cameras, battery life, and materials to find your perfect match.
            </p>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {compareList.length > 1 && (
              <button
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  highlightDifferences
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white text-black border-black/15 hover:bg-black/5"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>{highlightDifferences ? "Highlighting differences" : "Highlight differences"}</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-black/50 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
              >
                <RotateCcw size={13} />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Comparison Area */}
      <section className="max-w-7xl mx-auto px-4 md:px-12">
        {compareList.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 max-w-2xl mx-auto bg-black/[0.02] border border-black/5 rounded-3xl"
          >
            <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center mx-auto mb-6 text-black">
              <Layers size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-3">
              No devices selected to compare
            </h2>
            <p className="text-black/60 text-sm md:text-base leading-relaxed mb-8">
              Select up to 4 iPhone models from our shop, or load recommended popular models to start comparing technical specifications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLoadPresets}
                className="w-full sm:w-auto bg-black text-white px-6 py-3.5 rounded-2xl text-xs font-bold hover:bg-black/80 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Compare Popular Models</span>
              </button>
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-white border border-black/15 text-black px-6 py-3.5 rounded-2xl text-xs font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Browse All Products</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Sticky/Fixed-style Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Render Selected Products */}
              {compareList.map((product, index) => {
                const colorIdx = selectedColorMap[product.id] || 0;
                const activeColor = product.colors?.[colorIdx];
                const activeImage =
                  activeColor?.images && activeColor.images.length > 0
                    ? activeColor.images[0]
                    : product.imageSrc;

                const activeStorage =
                  selectedStorageMap[product.id] || product.storage?.[0]?.size || "Base";
                const displayPrice =
                  product.storage?.find((s) => s.size === activeStorage)?.price || product.price;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm flex flex-col relative group"
                  >
                    {/* Top Row: Dropdown Switcher & Remove button */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setActivePickerSlot(index)}
                        className="text-xs font-semibold text-black/60 hover:text-black flex items-center gap-1 bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-full transition-colors truncate max-w-[170px]"
                        title="Change model"
                      >
                        <span className="truncate">Change model</span>
                        <ChevronRight size={12} />
                      </button>

                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="p-1.5 text-black/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove device"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Image Box */}
                    <div className="relative aspect-square w-full rounded-2xl bg-black/[0.02] flex items-center justify-center p-6 mb-4 overflow-hidden">
                      <img
                        src={activeImage}
                        alt={product.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Color swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {product.colors.map((c, cIdx) => (
                          <button
                            key={c.name}
                            onClick={() =>
                              setSelectedColorMap((prev) => ({
                                ...prev,
                                [product.id]: cIdx,
                              }))
                            }
                            className={`w-5 h-5 rounded-full border transition-all ${
                              colorIdx === cIdx
                                ? "ring-2 ring-black ring-offset-2 scale-110 border-transparent"
                                : "border-black/20 hover:scale-105"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}

                    {/* Title & Tagline */}
                    <div className="text-center mb-4">
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        <h3 className="text-xl font-bold text-black tracking-tight line-clamp-1">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-black/50 mt-1 line-clamp-1">
                        {product.subtitle || "Engineered for excellence"}
                      </p>
                      <p className="text-lg font-bold text-black mt-2">
                        {displayPrice}
                      </p>
                    </div>

                    {/* Storage selector pills */}
                    {product.storage && product.storage.length > 0 && (
                      <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
                        {product.storage.map((s) => (
                          <button
                            key={s.size}
                            onClick={() =>
                              setSelectedStorageMap((prev) => ({
                                ...prev,
                                [product.id]: s.size,
                              }))
                            }
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                              activeStorage === s.size
                                ? "bg-black text-white border-black"
                                : "bg-black/5 text-black/70 border-transparent hover:bg-black/10"
                            }`}
                          >
                            {s.size}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => handleCheckoutProduct(product)}
                        className="w-full bg-black text-white hover:bg-black/85 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                      >
                        <ShoppingBag size={14} />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty Slots to add up to 4 */}
              {Array.from({ length: maxCompareLimit - compareList.length }).map((_, index) => {
                const slotIdx = compareList.length + index;
                return (
                  <div
                    key={`slot-${slotIdx}`}
                    onClick={() => setActivePickerSlot(slotIdx)}
                    className="border-2 border-dashed border-black/15 hover:border-black/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[360px] group bg-black/[0.01] hover:bg-black/[0.03]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black/40 group-hover:text-black group-hover:bg-black/10 transition-all mb-4">
                      <Plus size={24} />
                    </div>
                    <span className="text-sm font-bold text-black/70 group-hover:text-black transition-colors">
                      Add a Model
                    </span>
                    <span className="text-xs text-black/40 mt-1 max-w-[140px]">
                      Choose an iPhone to compare
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Comprehensive Specifications Comparison Table */}
            <div className="space-y-12">
              {/* Section 1: Quick Overview */}
              <SpecSection
                title="Quick Overview"
                icon={<Smartphone size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Display Size"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).displaySize)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <span className="font-semibold text-black">
                      {getProductSpecs(p).displaySize}
                    </span>
                  )}
                />
                <SpecRow
                  label="Processor / Chip"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).chip)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <span className="font-semibold text-black">
                      {getProductSpecs(p).chip}
                    </span>
                  )}
                />
                <SpecRow
                  label="Camera System"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).mainCameraType)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <span className="text-black">
                      {getProductSpecs(p).mainCameraType}
                    </span>
                  )}
                />
                <SpecRow
                  label="Battery Charging"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).charging)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <span className="text-black">
                      {getProductSpecs(p).charging}
                    </span>
                  )}
                />
              </SpecSection>

              {/* Section 2: Display & Design */}
              <SpecSection
                title="Display & Design"
                icon={<Tv size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Screen Type"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).displayType)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).displayType}
                />
                <SpecRow
                  label="Resolution"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).displayResolution)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).displayResolution}
                />
                <SpecRow
                  label="Build & Materials"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).build)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).build}
                />
                <SpecRow
                  label="Dimensions"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).dimensions)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).dimensions}
                />
                <SpecRow
                  label="Weight"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).weight)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).weight}
                />
                <SpecRow
                  label="Available Finishes"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).colorsList)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).colorsList}
                />
              </SpecSection>

              {/* Section 3: Chip & Performance */}
              <SpecSection
                title="Chip & Performance"
                icon={<Cpu size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Processor"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).chip)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <div className="flex flex-col">
                      <span className="font-bold text-black">{getProductSpecs(p).chip}</span>
                      <span className="text-[11px] text-black/50">Next-gen neural engine & hardware ray tracing</span>
                    </div>
                  )}
                />
                <SpecRow
                  label="Operating System"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).os)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).os}
                />
                <SpecRow
                  label="Storage Capacities"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).storageList)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-black">{getProductSpecs(p).storageList}</span>
                      {p.storage && p.storage.length > 0 && (
                        <span className="text-[11px] text-black/50">
                          {p.storage.map((s) => `${s.size}: ${s.price}`).join(" | ")}
                        </span>
                      )}
                    </div>
                  )}
                />
              </SpecSection>

              {/* Section 4: Camera System */}
              <SpecSection
                title="Camera System"
                icon={<Camera size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Main Camera Array"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).mainCamera)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).mainCamera}
                />
                <SpecRow
                  label="Video Capture"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).mainCameraVideo)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).mainCameraVideo}
                />
                <SpecRow
                  label="Front / TrueDepth Camera"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).selfieCamera)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).selfieCamera}
                />
                <SpecRow
                  label="Selfie Video Recording"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).selfieCameraVideo)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).selfieCameraVideo}
                />
              </SpecSection>

              {/* Section 5: Battery & Power */}
              <SpecSection
                title="Battery & Charging"
                icon={<BatteryCharging size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Battery Construction"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).batteryType)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).batteryType}
                />
                <SpecRow
                  label="Charging Speed & Capabilities"
                  isDifferent={isRowDifferent((p) => getProductSpecs(p).charging)}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => getProductSpecs(p).charging}
                />
              </SpecSection>

              {/* Section 6: Standout Features */}
              <SpecSection
                title="Key Highlights & Features"
                icon={<Shield size={18} className="text-black" />}
                highlightDifferences={highlightDifferences}
              >
                <SpecRow
                  label="Highlights"
                  isDifferent={false}
                  highlight={highlightDifferences}
                  products={compareList}
                  renderValue={(p) => (
                    <div className="space-y-2 text-left">
                      {p.features && p.features.length > 0 ? (
                        p.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2">
                            <Check size={14} className="text-black shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-black text-xs">{feat.title}</p>
                              <p className="text-[11px] text-black/60 leading-tight">{feat.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-black/50">Titanium frame, Ceramic Shield, Action Button</span>
                      )}
                    </div>
                  )}
                />
              </SpecSection>
            </div>
          </div>
        )}
      </section>

      {/* Model Selector Modal / Drawer */}
      <AnimatePresence>
        {activePickerSlot !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setActivePickerSlot(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div>
                  <h3 className="text-xl font-bold text-black">Select an iPhone Model</h3>
                  <p className="text-xs text-black/50">
                    Slot {activePickerSlot + 1} of {maxCompareLimit}
                  </p>
                </div>
                <button
                  onClick={() => setActivePickerSlot(null)}
                  className="p-2 text-black/40 hover:text-black rounded-full hover:bg-black/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="py-4">
                <input
                  type="text"
                  placeholder="Search by model name or feature..."
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-black/5 rounded-2xl text-sm outline-none border border-transparent focus:border-black/20 transition-all placeholder:text-black/40"
                  autoFocus
                />
              </div>

              {/* Product List */}
              <div className="overflow-y-auto space-y-3 flex-grow pr-1">
                {filteredPickerProducts.length > 0 ? (
                  filteredPickerProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectDeviceForSlot(p, activePickerSlot)}
                      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 border border-transparent hover:border-black/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black/[0.03] rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-black/5">
                          <img
                            src={p.imageSrc}
                            alt={p.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-black text-sm">{p.title}</h4>
                          <p className="text-xs text-black/50 line-clamp-1">{p.subtitle || p.category}</p>
                          <span className="text-xs font-semibold text-black mt-1 inline-block">
                            {p.price}
                          </span>
                        </div>
                      </div>

                      <button className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold group-hover:bg-black/80 transition-colors flex items-center gap-1">
                        <span>Select</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-black/40">
                    <p className="text-sm">No additional models match your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Subcomponent: Collapsible/Structured Spec Section
function SpecSection({
  title,
  icon,
  children,
  highlightDifferences,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  highlightDifferences: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
      <div className="bg-black/[0.02] px-6 py-4 border-b border-black/10 flex items-center gap-2.5">
        <div className="p-1.5 bg-black/5 rounded-xl">{icon}</div>
        <h3 className="font-bold text-sm tracking-tight text-black uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-black/5">{children}</div>
    </div>
  );
}

// Subcomponent: Comparative Spec Row
function SpecRow({
  label,
  isDifferent,
  highlight,
  products,
  renderValue,
}: {
  label: string;
  isDifferent: boolean;
  highlight: boolean;
  products: Product[];
  renderValue: (p: Product) => React.ReactNode;
}) {
  const isHighlighted = highlight && isDifferent;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-5 p-4 md:p-6 transition-colors ${
        isHighlighted ? "bg-amber-500/[0.07]" : "hover:bg-black/[0.01]"
      }`}
    >
      {/* Spec Label */}
      <div className="lg:col-span-1 font-semibold text-xs text-black/50 uppercase tracking-wider mb-2 lg:mb-0 flex items-center gap-2">
        <span>{label}</span>
        {isHighlighted && (
          <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
            Differs
          </span>
        )}
      </div>

      {/* Product Columns (up to 4) */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs md:text-sm">
        {products.map((product) => (
          <div key={product.id} className="text-black/80 font-normal">
            {renderValue(product)}
          </div>
        ))}
        {/* Placeholder cells for empty slots */}
        {Array.from({ length: 4 - products.length }).map((_, idx) => (
          <div key={`empty-${idx}`} className="hidden lg:block text-black/20 text-xs">
            —
          </div>
        ))}
      </div>
    </div>
  );
}
