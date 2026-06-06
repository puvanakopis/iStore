"use client";

import { useState, useEffect } from "react";
import StatsGrid from "@/components/admin/StatsGrid";
import RevenueChart from "./_components/RevenueChart";
import CategoryChart from "./_components/CategoryChart";
import AdminHeader from "@/components/admin/AdminHeader";
import { DollarSign, ShoppingCart, Users, Package, Smartphone } from "lucide-react";
import { userService } from "@/services/user.service";
import { productService } from "@/services/product.service";
import api from "@/services/api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "Rs. 0", change: "+0%", trendingUp: true, icon: DollarSign },
    { label: "Active Orders", value: "0", change: "+0%", trendingUp: true, icon: ShoppingCart },
    { label: "Total Customers", value: "0", change: "+0%", trendingUp: true, icon: Users },
    { label: "Low Stock Items", value: "0", change: "Alert", trendingUp: false, icon: Package, alert: true },
  ]);

  const [categories, setCategories] = useState([
    { name: "Pro Max Series", percentage: 0, color: "bg-gray-900", icon: Smartphone },
    { name: "Pro Series", percentage: 0, color: "bg-primary", icon: Smartphone },
    { name: "Plus Series", percentage: 0, color: "bg-blue-500", icon: Smartphone },
    { name: "Standard Series", percentage: 0, color: "bg-purple-500", icon: Smartphone },
  ]);
  
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [revenueData, setRevenueData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load resources concurrently
        const [usersData, productsData, ordersRes] = await Promise.all([
          userService.getAll(),
          productService.getAll(),
          api.get("/orders/all")
        ]);
        
        const ordersData = ordersRes.data || [];
        
        // Calculate Total Revenue
        const totalRevenue = ordersData.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
        
        // Calculate Active Orders (status not Cancelled and not Delivered)
        const activeOrders = ordersData.filter((order: any) => 
          order.status !== "Cancelled" && order.status !== "Delivered"
        ).length;
        
        // Calculate Total Customers
        const totalCustomers = usersData.filter((user: any) => user.role === "Customer").length;
        
        // Low Stock Items: define as products having fewer than 2 storage options
        const lowStockItems = productsData.filter((prod: any) => !prod.storage || prod.storage.length < 2).length;
        
        // Update stats
        setStats([
          { 
            label: "Total Revenue", 
            value: `Rs. ${new Intl.NumberFormat('en-IN').format(totalRevenue)}`, 
            change: "+12.5%", 
            trendingUp: true, 
            icon: DollarSign 
          },
          { 
            label: "Active Orders", 
            value: String(activeOrders), 
            change: "+8.2%", 
            trendingUp: true, 
            icon: ShoppingCart 
          },
          { 
            label: "Total Customers", 
            value: String(totalCustomers), 
            change: "+2.4%", 
            trendingUp: true, 
            icon: Users 
          },
          { 
            label: "Low Stock Items", 
            value: String(lowStockItems), 
            change: "Alert", 
            trendingUp: false, 
            icon: Package, 
            alert: true 
          },
        ]);
        
        // Group revenue by month for the last 6 months
        const monthlyData = Array(6).fill(0).map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return {
            month: d.toLocaleString('default', { month: 'short' }),
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            amount: 0
          };
        }).reverse();

        ordersData.forEach((order: any) => {
          if (!order.created_at) return;
          const orderDate = new Date(order.created_at);
          const oMonth = orderDate.getMonth();
          const oYear = orderDate.getFullYear();
          
          const target = monthlyData.find(m => m.monthIndex === oMonth && m.year === oYear);
          if (target) {
            target.amount += order.total || 0;
          }
        });

        setRevenueData(monthlyData.map(m => ({ month: m.month, amount: m.amount })));

        // Calculate total products sold (sum quantity of all items in all orders)
        let totalSold = 0;
        let proMaxCount = 0;
        let proCount = 0;
        let plusCount = 0;
        let stdCount = 0;
        
        ordersData.forEach((order: any) => {
          (order.items || []).forEach((item: any) => {
            const qty = item.quantity || 1;
            totalSold += qty;
            
            const title = (item.title || "").toLowerCase();
            if (title.includes("pro max")) {
              proMaxCount += qty;
            } else if (title.includes("pro")) {
              proCount += qty;
            } else if (title.includes("plus")) {
              plusCount += qty;
            } else {
              stdCount += qty;
            }
          });
        });
        
        setTotalProductsSold(totalSold);
        
        // Calculate category percentages
        const totalCategoryCount = proMaxCount + proCount + plusCount + stdCount || 1;
        
        setCategories([
          { 
            name: "Pro Max Series", 
            percentage: Math.round((proMaxCount / totalCategoryCount) * 100), 
            color: "bg-gray-900", 
            icon: Smartphone 
          },
          { 
            name: "Pro Series", 
            percentage: Math.round((proCount / totalCategoryCount) * 100), 
            color: "bg-primary", 
            icon: Smartphone 
          },
          { 
            name: "Plus Series", 
            percentage: Math.round((plusCount / totalCategoryCount) * 100), 
            color: "bg-blue-500", 
            icon: Smartphone 
          },
          { 
            name: "Standard Series", 
            percentage: Math.round((stdCount / totalCategoryCount) * 100), 
            color: "bg-purple-500", 
            icon: Smartphone 
          },
        ]);
        
        setError(null);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <AdminHeader 
          title="Dashboard Overview"
          subtitle="Track your store's performance metrics and analytics"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm font-medium">Loading metrics...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RevenueChart data={revenueData} />
              <CategoryChart categories={categories} totalUnits={totalProductsSold} title="Model Distribution" subtitle="Sales breakdown by iPhone series" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}