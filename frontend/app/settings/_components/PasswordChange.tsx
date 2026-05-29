"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Key } from "lucide-react";
import { useState } from "react";

export default function PasswordChange() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Security</h3>
          <p className="text-sm text-foreground-secondary font-light">
            Update your password and secure your account
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <Lock size={20} />
        </div>
      </header>

      <form className="space-y-6">
        <div className="flex flex-col">
          <label
            className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
            htmlFor="currentPassword"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
            />
            <Key
              size={16}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
            />
          </div>
        </div>

        <div className="pt-4 divide-y divide-border/50">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black">
                <Shield size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">
                  Two-Factor Authentication
                </h4>
                <p className="text-[13px] text-foreground-secondary font-light">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative w-11 h-6 transition-colors duration-300 rounded-full ${
                twoFactorEnabled ? "bg-black" : "bg-border"
              }`}
            >
              <motion.div
                animate={{ x: twoFactorEnabled ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            Update Security
          </button>
        </div>
      </form>
    </motion.div>
  );
}