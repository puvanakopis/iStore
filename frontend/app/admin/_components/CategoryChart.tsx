"use client";

import { motion } from "framer-motion";
import { Package, LucideIcon } from "lucide-react";

export interface Category {
  name: string;
  percentage: number;
  color: string;
  icon: LucideIcon;
}

interface CategoryChartProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
  totalUnits?: number;
  delay?: number;
}

export default function CategoryChart({
  categories,
  title = "Category Distribution",
  subtitle = "Sales breakdown by category",
  totalUnits = 1234,
  delay = 0.25,
}: CategoryChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="bg-white p-6 md:p-8 rounded-sm border border-border transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[20px] md:text-[24px] font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <p className="text-[14px] text-foreground-secondary font-light mt-1">
            {subtitle}
          </p>
        </div>
        <Package size={22} className="text-gray-400" strokeWidth={1.5} />
      </div>

      <div className="space-y-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <category.icon size={16} className="text-gray-500" />
                <span className="text-[14px] font-semibold text-gray-700">
                  {category.name}
                </span>
              </div>
              <span className="text-[14px] font-bold text-gray-900">
                {category.percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-full ${category.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-foreground-muted">Total Products Sold</span>
          <span className="font-bold text-gray-900">{totalUnits.toLocaleString()} units</span>
        </div>
      </div>
    </motion.div>
  );
}