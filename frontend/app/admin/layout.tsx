import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IStore Admin",
  description: "Admin panel for managing products, users, and orders.",
};

export default function AdminLayout({
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
          <ProductProvider>
            <div className="min-h-screen flex flex-col">
              <AdminNavbar />
              <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}