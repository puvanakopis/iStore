"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Users", href: "/admin/users" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-black/5"
    >
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Brand */}
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold tracking-tighter text-[20px] group"
        >
          <span className="group-hover:opacity-70 transition-opacity">iStore</span>
          <span className="text-[9px] bg-black text-white px-2 py-[2px] rounded uppercase tracking-widest">
            Admin
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-[13px] font-medium tracking-tight transition-all duration-300 ${isActive ? "text-black" : "text-black/40 hover:text-black"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-black origin-left transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 pl-5 border-l border-black/5"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-semibold text-black leading-tight">
                  {user?.first_name || "Admin"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-black/40">
                  Manager
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-bold">
                {user?.first_name?.[0] || "A"}
              </div>

              <ChevronDown size={16} className="text-black/40" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}