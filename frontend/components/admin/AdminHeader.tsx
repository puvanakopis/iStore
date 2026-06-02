"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  delay?: number;
}

export default function AdminHeader({
  title,
  subtitle,
  actions,
  className = "",
  delay = 0.8,
}: AdminHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: delay }}
      className={`pt-8 md:pt-12 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight leading-[1.1] text-gray-900 pt-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-foreground-secondary text-lg font-light tracking-tight leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </motion.div>
  );
}