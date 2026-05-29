"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Award } from "lucide-react";

export default function ProfileBentoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      {/* 1:1 split layout */}
      <div className="flex items-stretch">
        {/* LEFT SIDE - IMAGE */}
        <div className="w-1/2 flex items-center justify-center relative">
          <div className="relative group">
            {/* BIG BOX IMAGE */}
            <div className="w-56 h-56 rounded-sm border border-border p-2 group-hover:border-black transition-colors duration-300 shadow-sm">
              <div className="w-full h-full rounded-sm bg-black/5 flex items-center justify-center">
                <span className="text-5xl font-bold text-foreground-secondary">
                  JD
                </span>
              </div>
            </div>

            {/* badge */}
            <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-sm">
              <Award size={14} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="w-1/2 pl-8 flex flex-col justify-center">
          {/* Name */}
          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight">
              Johnathan Doe
            </h2>
            <p className="text-sm text-foreground-secondary font-light mt-1">
              Platinum Elite Member since 2024
            </p>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Mail size={18} />
              </div>
              <span className="text-sm font-light text-foreground-secondary group-hover:text-black transition-colors">
                john.doe@icloud.com
              </span>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Phone size={18} />
              </div>
              <span className="text-sm font-light text-foreground-secondary group-hover:text-black transition-colors">
                +1 (555) 000-0000
              </span>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <MapPin size={18} />
              </div>
              <span className="text-sm font-light text-foreground-secondary group-hover:text-black transition-colors">
                San Francisco, CA
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}