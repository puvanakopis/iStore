"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

export default function LoginActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Login Activity</h3>
          <p className="text-sm text-foreground-secondary font-light">
            Recent sign-ins to your account
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {[
          {
            device: 'MacBook Pro 14"',
            location: "San Francisco, CA",
            date: "Currently active",
            current: true,
          },
          {
            device: "iPhone 15 Pro",
            location: "San Francisco, CA",
            date: "2 hours ago",
            current: false,
          },
        ].map((session, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
                <Smartphone size={18} />
              </div>

              <div>
                <h4 className="text-sm font-bold tracking-tight">
                  {session.device}
                </h4>
                <p className="text-[12px] text-foreground-muted font-light">
                  {session.location} • {session.date}
                </p>
              </div>
            </div>

            {session.current ? (
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>
            ) : (
              <button className="text-[12px] text-foreground-secondary hover:text-black transition-colors font-medium">
                Log Out
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}