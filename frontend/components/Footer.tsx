"use client";

import { MessageCircle, Camera, Music, X } from "lucide-react";
import { usePathname } from "next/navigation";

const quickLinks = [
  "About Us",
  "Delivery",
  "Privacy Policy",
  "Terms & Conditions",
  "My Profile",
  "Order History",
];

const accountLinks = [
  "My Account",
  "Order History",
  "Affiliates",
  "Newsletter",
  "Gift Certificates",
];

const customerServiceLinks = [
  "Contact Us",
  "Item Returns (RMA)",
  "Site Map",
  "Our Brands",
];

const categoryLinks = [
  "Apple",
  "Android Phone",
  "Electronic Devices",
  "Accessories",
  "Used / Pre-Owned",
  "Daily Deals",
];

const socialLinks = [
  { name: "Facebook", icon: MessageCircle },
  { name: "Instagram", icon: Camera },
  { name: "X (Twitter)", icon: X },
  { name: "TikTok", icon: Music },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full bg-white text-foreground-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 text-[12px]">

        {/* Top Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 pb-16">

          {/* Quick Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-[12px] font-bold text-foreground tracking-tight mb-2 uppercase">
              Shop and Learn
            </h3>
            {quickLinks.map((item) => (
              <a key={item} href="#" className="hover:text-foreground hover:underline underline-offset-4 transition-all">
                {item}
              </a>
            ))}
          </div>

          {/* My Account */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-[12px] font-bold text-foreground tracking-tight mb-2 uppercase">
              Account
            </h3>
            {accountLinks.map((item) => (
              <a key={item} href="#" className="hover:text-foreground hover:underline underline-offset-4 transition-all">
                {item}
              </a>
            ))}
          </div>

          {/* Customer Service */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-[12px] font-bold text-foreground tracking-tight mb-2 uppercase">
              Services
            </h3>
            {customerServiceLinks.map((item) => (
              <a key={item} href="#" className="hover:text-foreground hover:underline underline-offset-4 transition-all">
                {item}
              </a>
            ))}
          </div>

          {/* Categories */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-[12px] font-bold text-foreground tracking-tight mb-2 uppercase">
              Categories
            </h3>
            {categoryLinks.map((item) => (
              <a key={item} href="#" className="hover:text-foreground hover:underline underline-offset-4 transition-all">
                {item}
              </a>
            ))}
          </div>

          {/* Brand + Information */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                iStore
              </h2>
              <p className="text-foreground-muted leading-relaxed max-w-[200px]">
                The best way to buy the products you love.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 text-[11px]">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border pt-4">
            <p>
              Copyright © 2026 iStore Inc. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-6">
              {["Privacy Policy", "Terms of Use", "Sales Policy", "Site Map"].map(
                (item) => (
                  <a key={item} href="#" className="hover:text-foreground">
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}