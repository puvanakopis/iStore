"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string;
  change: string;
  trendingUp: boolean;
  icon: LucideIcon;
  alert?: boolean;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
  delay?: number;
}

export default function StatsGrid({ stats, className = "", delay = 0.1 }: StatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group bg-white p-6 md:p-8 rounded-sm border border-border transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gray-900 text-white rounded-2xl transition-transform duration-500">
              <stat.icon size={22} strokeWidth={1.5} />
            </div>
            <div
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-tighter ${
                stat.alert
                  ? "bg-red-50 text-red-600"
                  : stat.trendingUp
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {stat.change}
              {!stat.alert &&
                (stat.trendingUp ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] text-foreground-muted font-medium mb-1 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}