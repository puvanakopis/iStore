"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border h-12 md:h-14">
      <div className="relative flex justify-between items-center h-full px-6 md:px-12 max-w-7xl mx-auto">

        {/* Brand */}
        <div className="text-[18px] md:text-[21px] font-bold tracking-tight text-foreground cursor-pointer">
          iStore
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <a
                key={link.name}
                href={link.href}
                className={`text-[12px] font-medium tracking-tight transition-colors duration-200 ${isActive
                  ? "text-foreground"
                  : "text-foreground-muted hover:text-foreground"
                  }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-7 text-foreground">
          <button className="hover:opacity-60 transition-opacity">
            <Search size={16} />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <ShoppingBag size={16} />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <User size={16} />
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-foreground-muted hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 bottom-0 bg-white flex flex-col z-40">

          {/* CENTERED LINKS */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[24px] font-semibold tracking-tight transition-colors ${isActive
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground"
                    }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Bottom Icons */}
          <div className="border-t border-border px-6 py-4">
            <div className="flex items-center justify-between">

              <button className="flex flex-col items-center gap-1 text-[#86868b] hover:text-black transition-colors w-1/3">
                <Search size={16} />
                <span className="text-[11px]">Search</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-[#86868b] hover:text-black transition-colors w-1/3">
                <ShoppingBag size={16} />
                <span className="text-[11px]">Bag</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-[#86868b] hover:text-black transition-colors w-1/3">
                <User size={16} />
                <span className="text-[11px]">Profile</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}