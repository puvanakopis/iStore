"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueChartProps {
  title?: string;
  subtitle?: string;
  trend?: string;
  trendValue?: string;
  delay?: number;
}

export default function RevenueChart({
  title = "Revenue Analytics",
  subtitle = "Monthly revenue trends and projections",
  trend = "+23.5% vs last month",
  delay = 0.2,
}: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="lg:col-span-2 bg-white p-6 md:p-8 rounded-sm border border-border transition-all duration-500"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-[20px] md:text-[24px] font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <p className="text-[14px] text-foreground-secondary font-light mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
          <TrendingUp size={14} />
          {trend}
        </div>
      </div>

      <div className="h-[320px] flex items-center justify-center text-foreground-muted font-medium text-[14px] uppercase tracking-widest bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-center">
          <DollarSign size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
          <p className="text-gray-500">Interactive Chart Component</p>
          <p className="text-[11px] text-gray-400 mt-2">
            (Integrate Recharts/Chart.js for actual data)
          </p>
        </div>
      </div>
    </motion.div>
  );
}