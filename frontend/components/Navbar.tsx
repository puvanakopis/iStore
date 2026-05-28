"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 20) setMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 h-16"
          : "bg-transparent h-20"
        }`}
    >
      <div className="relative flex justify-between items-center h-full px-6 md:px-12 max-w-7xl mx-auto">

        {/* Brand */}
        <Link
          href="/"
          className="text-[20px] md:text-[24px] font-bold tracking-tighter text-black flex items-center gap-2 group"
        >
          <span className="group-hover:opacity-70 transition-opacity">iStore</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[13px] font-medium tracking-tight transition-all duration-300 relative py-1 px-1 group ${isActive
                    ? "text-black"
                    : "text-foreground-muted hover:text-black"
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-black transition-transform duration-500 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
              </Link>
            );
          })}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-8 text-black">
          <button className="hover:scale-110 transition-transform cursor-pointer">
            <Search size={18} strokeWidth={2} />
          </button>
          <button className="hover:scale-110 transition-transform cursor-pointer relative">
            <ShoppingBag size={18} strokeWidth={2} />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
          </button>
          <button className="hover:scale-110 transition-transform cursor-pointer">
            <User size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-black p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Full Screen Apple Aesthetic */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-0 inset-0 bg-white z-40 flex flex-col pt-32 px-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-[36px] font-bold tracking-tighter transition-colors ${isActive ? "text-black" : "text-foreground-muted"}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Contact-style Footer for Mobile Menu */}
            <div className="mt-auto pb-16 flex flex-col gap-10">
              <div className="flex gap-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-foreground-muted">Support</span>
                  <span className="text-sm font-medium">help@istore.com</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-foreground-muted">Follow</span>
                  <span className="text-sm font-medium">@istore_global</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 pt-6 border-t border-black/5">
                <Search size={22} strokeWidth={1.5} />
                <ShoppingBag size={22} strokeWidth={1.5} />
                <User size={22} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}