"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Users", href: "/admin/users" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-black/5"
    >
      <div className="h-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="text-[20px] font-bold tracking-tighter text-black group-hover:opacity-70 transition-opacity">
              iStore
            </span>
            <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
              Admin
            </span>
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center text-[13px] font-medium tracking-tight transition-all duration-300 group ${
                    isActive ? "text-black" : "text-black/40 hover:text-black"
                  }`}
                >
                  <span>{item.name}</span>

                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[1.5px] bg-black origin-left transition-transform duration-500 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-black/40 hover:text-black hover:scale-110 transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-black/5">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-bold text-black leading-tight">
                {user ? `${user.first_name} ${user.last_name}` : "Admin"}
              </p>
              <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">
                Manager
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-[12px]">
              {user?.first_name?.[0] || "A"}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}