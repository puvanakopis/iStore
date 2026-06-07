import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SearchProvider } from "@/contexts/SearchContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IStore",
  description: "Experience the unprecedented power of Titanium. Lighter, stronger, and built for the most ambitious tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <SearchProvider>
                  <Navbar />
                  {children}
                  <Footer />
                </SearchProvider>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}