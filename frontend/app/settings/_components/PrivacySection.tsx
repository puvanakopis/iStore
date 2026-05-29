"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function PrivacySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Privacy</h3>
          <p className="text-sm text-foreground-secondary font-light">
            Control your data and visibility
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <Eye size={20} />
        </div>
      </header>

      <div className="space-y-4 divide-y divide-border/50">
        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-sm font-bold tracking-tight">
              Public Profile
            </h4>
            <p className="text-[13px] text-foreground-secondary font-light">
              Allow others to see your reviews and wishlist.
            </p>
          </div>
          <button className="relative w-11 h-6 bg-border rounded-full">
            <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute left-0.5 top-0.5" />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-sm font-bold tracking-tight">
              Data Usage
            </h4>
            <p className="text-[13px] text-foreground-secondary font-light">
              Allow us to use your data to personalize your experience.
            </p>
          </div>
          <button className="relative w-11 h-6 bg-black rounded-full">
            <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute right-0.5 top-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}