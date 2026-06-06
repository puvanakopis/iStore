"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User, Heart, Settings, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const userLinks = [
  { icon: User, label: "Personal Info", href: "/profile" },
  { icon: ShoppingBag, label: "Order History", href: "/orders" },
  { icon: Heart, label: "My Wishlist", href: "/wishlist" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

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
          <Link href="/cart" className="hover:scale-110 transition-transform cursor-pointer relative">
            <ShoppingBag size={18} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-black/10 border-t-black animate-spin" />
          ) : user ? (
            <div
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button className="hover:scale-110 transition-transform cursor-pointer pt-1">
                <User size={18} strokeWidth={2} />
              </button>
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden p-2"
                  >
                    {userLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 text-[13px] font-medium tracking-tight rounded-2xl hover:bg-black/5 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                          <link.icon size={14} strokeWidth={2} />
                        </div>
                        <span className="text-black/70 group-hover:text-black transition-colors">{link.label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-black/5 mt-2 pt-2 px-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-[13px] font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200"
                      >
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer group"
            >
              <User size={18} strokeWidth={2} className="text-black" />
              <span className="text-[13px] font-medium tracking-tight text-black">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile View Icons & Button */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative p-2 text-black" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingBag size={22} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="text-black p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Apple Aesthetic */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-0 inset-0 bg-white/90 backdrop-blur-2xl z-40 flex flex-col pt-32 px-10"
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

            {/* Mobile User Links */}
            {loading ? (
                <div className="mt-12 pt-12 border-t border-black/5 flex justify-center">
                    <div className="w-8 h-8 rounded-full border-3 border-black/10 border-t-black animate-spin" />
                </div>
            ) : user ? (
              <div className="flex flex-col gap-5 mt-12 pt-12 border-t border-black/5">
                {userLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                          <link.icon size={18} strokeWidth={2} />
                        </div>
                        <span className="text-[18px] font-semibold tracking-tight">{link.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-foreground-muted" />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + userLinks.length * 0.1 }}
                >
                  <button
                    onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between group w-full text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                        <User size={18} strokeWidth={2} className="text-red-500 group-hover:text-white" />
                      </div>
                      <span className="text-[18px] font-semibold tracking-tight text-red-500">Log Out</span>
                    </div>
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="mt-12 pt-12 border-t border-black/5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <User size={18} strokeWidth={2} />
                      </div>
                      <span className="text-[18px] font-semibold tracking-tight">Sign In</span>
                    </div>
                    <ChevronRight size={18} className="text-foreground-muted" />
                  </Link>
                </motion.div>
              </div>
            )}

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
                <Link href={user ? "/profile" : "/signin"} onClick={() => setMobileMenuOpen(false)}>
                  <User size={22} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}