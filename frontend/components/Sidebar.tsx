"use client";

import { User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: User, label: "Personal Info", href: "/profile" },
  { icon: ShoppingBag, label: "Order History", href: "/orders" },
  { icon: Heart, label: "My Wishlist", href: "/wishlist" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 flex flex-col gap-8 h-fit lg:sticky lg:top-32">

      {/* Navigation Groups */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-widest text-foreground-muted font-bold px-4 mb-2">
          Account Settings
        </span>

        <div
          className="
            flex flex-row lg:flex-col
            gap-x-2 lg:gap-x-0
            lg:space-y-2
            overflow-x-auto pb-4 lg:pb-0
            scrollbar-hide
          "
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group whitespace-nowrap ${isActive
                    ? "bg-black text-white shadow-lg shadow-black/5"
                    : "text-foreground-secondary hover:bg-black/5"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive
                      ? "bg-white/10"
                      : "bg-black/5 group-hover:bg-black/10"
                    }`}
                >
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-white"
                        : "text-black group-hover:text-black"
                    }
                  />
                </div>

                <span className="text-[14px] font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support / Secondary */}
      <div className="mt-auto pt-8 border-t border-border flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 w-full group">
          <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
            <LogOut size={16} className="text-red-500" />
          </div>
          <span className="text-[14px] font-medium tracking-tight">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}