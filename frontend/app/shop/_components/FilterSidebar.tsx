"use client";

import { FilterState } from "../page";

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
      priceRange: prev.priceRange[0] === range[0] && prev.priceRange[1] === range[1]
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

  const activeFilterCount = filters.models.length + filters.storage.length + (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000 ? 1 : 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[13px] font-semibold text-primary hover:text-primary underline underline-offset-4 tracking-tight transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Model Section */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Model</h3>
        <div className="flex flex-col gap-3">
          {MODELS.map((model) => (
            <label key={model} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={filters.models.includes(model)}
                    onChange={() => toggleModel(model)}
                    className="peer appearance-none w-5 h-5 rounded border border-gray-200 checked:bg-primary checked:border-border transition-all duration-300"
                  />
                  <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <span className={`text-[15px] tracking-tight transition-colors ${filters.models.includes(model) ? 'text-primary font-semibold' : 'text-foreground-secondary group-hover:text-primary font-light'}`}>
                  {model}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Price</h3>
        <div className="flex flex-col gap-3">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="price"
                  checked={filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1]}
                  onChange={() => handlePriceChange(range.value as [number, number])}
                  className="peer appearance-none w-5 h-5 rounded-full border border-gray-200 checked:bg-primary checked:border-border transition-all duration-300"
                />
                <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className={`text-[15px] tracking-tight transition-colors ${filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1] ? 'text-primary font-semibold' : 'text-foreground-secondary group-hover:text-primary font-light'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Section */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Storage</h3>
        <div className="grid grid-cols-2 gap-3">
          {STORAGE.map((size) => (
            <button
              key={size}
              onClick={() => toggleStorage(size)}
              className={`py-3 px-3 rounded-xl text-sm font-semibold border border-primary tracking-tight transition-all duration-300 ${filters.storage.includes(size)
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-100 text-foreground-secondary hover:border-primary hover:text-white hover:bg-primary'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

