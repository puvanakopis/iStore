"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueChartProps {
  title?: string;
  subtitle?: string;
  trend?: string;
  data?: { month: string; amount: number }[];
  delay?: number;
}

export default function RevenueChart({
  title = "Revenue Analytics",
  subtitle = "Monthly revenue trends and projections",
  trend = "Real-time updates",
  data = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 150000 },
    { month: "Mar", amount: 180000 },
    { month: "Apr", amount: 140000 },
    { month: "May", amount: 210000 },
    { month: "Jun", amount: 250000 },
  ],
  delay = 0.2,
}: RevenueChartProps) {
  
  // Calculate SVG dimensions
  const width = 500;
  const height = 200;
  const padding = 30;
  
  const maxAmount = Math.max(...data.map(d => d.amount), 100000);
  
  // Create points for SVG Path
  const points = data.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    // Invert Y coordinate because SVG 0 is top
    const y = height - padding - (d.amount / maxAmount) * (height - 2 * padding);
    return { x, y, label: d.month, amount: d.amount };
  });
  
  // SVG path definitions
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

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

      <div className="relative h-[250px] w-full mt-4 flex items-end">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grids */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (height - 2 * padding);
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
            );
          })}
          
          {/* Gradient Area under the line */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111827" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line path */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#111827"
            strokeWidth={3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Data points & labels */}
          {points.map((p, index) => (
            <g key={index}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#ffffff"
                stroke="#111827"
                strokeWidth={2}
                className="hover:r-6 cursor-pointer transition-all duration-300"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize={9}
                fontWeight="bold"
                fill="#4b5563"
              >
                Rs.{Math.round(p.amount / 1000)}k
              </text>
              <text
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                fontSize={10}
                fill="#9ca3af"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}