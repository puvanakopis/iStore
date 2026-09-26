import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { CompareProvider } from "@/contexts/CompareContext";

import ChatbotGate from "@/route/ChatbotGate";
import RouteGate from "@/route/RouteGate";
import RoleLayoutGate from "@/route/RoleLayoutGate";
import FloatingCompareBar from "@/components/FloatingCompareBar";

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
                <CompareProvider>
                  <CheckoutProvider>
                    <SearchProvider>
                      <RoleLayoutGate>
                        {children}
                      </RoleLayoutGate>
                      <FloatingCompareBar />
                      <ChatbotGate />
                    </SearchProvider>
                  </CheckoutProvider>
                </CompareProvider>
              </WishlistProvider>
            </ProductProvider>
          </RouteGate>
        </AuthProvider>
      </body>
    </html>
  );
}