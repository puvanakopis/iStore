"use client";

import { FilterState } from "../page";
import { Check } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const MODELS = ["iPhone 16", "iPhone 15", "iPhone 14", "iPhone 13"];
const STORAGE = ["128GB", "256GB", "512GB", "1TB"];
const PRICE_RANGES = [
  { label: "Under Rs. 150,000", value: [0, 150000] },
  { label: "Rs. 150,000 - Rs. 250,000", value: [150000, 250000] },
  { label: "Above Rs. 250,000", value: [250000, 1000000] },
];

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const toggleModel = (model: string) => {
    setFilters((prev) => ({
      ...prev,
      models: prev.models.includes(model)
        ? prev.models.filter((m) => m !== model)
        : [...prev.models, model],
    }));
  };

  const handlePriceChange = (range: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange:
        prev.priceRange[0] === range[0] && prev.priceRange[1] === range[1]
          ? [0, 1000000]
          : range,
    }));
  };

  const toggleStorage = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      storage: prev.storage.includes(size)
        ? prev.storage.filter((s) => s !== size)
        : [...prev.storage, size],
    }));
  };

  const clearFilters = () => {
    setFilters({
      models: [],
      colors: [],
      storage: [],
      priceRange: [0, 1000000],
    });
  };

  const activeFilterCount =
    filters.models.length +
    filters.storage.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000 ? 1 : 0);

  return (
    <div className="bg-[#f7f7f7] rounded-[24px] p-6 border border-black/[0.04] space-y-7 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[12px] font-semibold text-gray-500 hover:text-black underline underline-offset-4 tracking-tight transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Model Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Model
        </h3>
        <div className="space-y-2.5">
          {MODELS.map((model) => {
            const isChecked = filters.models.includes(model);
            return (
              <label
                key={model}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border ${
                    isChecked
                      ? "bg-black border-black text-white"
                      : "bg-white border-black/15 group-hover:border-black/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleModel(model)}
                    className="sr-only"
                  />
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </div>
                <span
                  className={`text-[14px] tracking-tight transition-colors ${
                    isChecked
                      ? "text-black font-semibold"
                      : "text-gray-600 group-hover:text-black font-normal"
                  }`}
                >
                  {model}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Price Range
        </h3>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((range) => {
            const isSelected =
              filters.priceRange[0] === range.value[0] &&
              filters.priceRange[1] === range.value[1];
            return (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 border ${
                    isSelected
                      ? "border-black bg-black"
                      : "border-black/15 bg-white group-hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="price"
                    checked={isSelected}
                    onChange={() => handlePriceChange(range.value as [number, number])}
                    className="sr-only"
                  />
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span
                  className={`text-[14px] tracking-tight transition-colors ${
                    isSelected
                      ? "text-black font-semibold"
                      : "text-gray-600 group-hover:text-black font-normal"
                  }`}
                >
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Storage Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Storage
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {STORAGE.map((size) => {
            const isSelected = filters.storage.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleStorage(size)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-gray-700 border border-black/[0.05] hover:border-black/20 hover:text-black shadow-2xs"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
