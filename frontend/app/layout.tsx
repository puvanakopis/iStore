import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SearchProvider } from "@/contexts/SearchContext";

import ChatbotGate from "@/route/ChatbotGate";
import RouteGate from "@/route/RouteGate";
import RoleLayoutGate from "@/route/RoleLayoutGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IStore",
  description:
    "Experience the unprecedented power of Titanium. Lighter, stronger, and built for the most ambitious tasks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <RouteGate>
            <ProductProvider>
              <WishlistProvider>
                <CheckoutProvider>
                  <SearchProvider>
                    <RoleLayoutGate>
                      {children}
                    </RoleLayoutGate>
                    <ChatbotGate />
                  </SearchProvider>
                </CheckoutProvider>
              </WishlistProvider>
            </ProductProvider>
          </RouteGate>
        </AuthProvider>
      </body>
    </html>
  );
}