"use client";

import StatsGrid from "@/components/admin/StatsGrid";
import RevenueChart from "./_components/RevenueChart";
import CategoryChart from "./_components/CategoryChart";
import AdminHeader from "@/components/admin/AdminHeader";
import { DollarSign, ShoppingCart, Users, Package, Smartphone, Headphones, Watch, Laptop } from "lucide-react";

const dashboardStats = [
  { 
    label: "Total Revenue", 
    value: "Rs. 2,450,000", 
    change: "+12.5%", 
    trendingUp: true, 
    icon: DollarSign 
  },
  { 
    label: "Active Orders", 
    value: "48", 
    change: "+8.2%", 
    trendingUp: true, 
    icon: ShoppingCart 
  },
  { 
    label: "Total Customers", 
    value: "1,240", 
    change: "-2.4%", 
    trendingUp: false, 
    icon: Users 
  },
  { 
    label: "Low Stock Items", 
    value: "12", 
    change: "Alert", 
    trendingUp: false, 
    icon: Package, 
    alert: true 
  },
];

const categories = [
  { name: "iPhone", percentage: 65, color: "bg-gray-900", icon: Smartphone },
  { name: "Accessories", percentage: 20, color: "bg-primary", icon: Headphones },
  { name: "Apple Watch", percentage: 10, color: "bg-blue-500", icon: Watch },
  { name: "MacBook", percentage: 5, color: "bg-purple-500", icon: Laptop },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto  space-y-12">
        
        {/* Page Header */}
        <AdminHeader 
          title="Dashboard Overview"
          subtitle="Track your store's performance metrics and analytics"
        />

        {/* Stats Grid */}
        <StatsGrid stats={dashboardStats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RevenueChart />
          <CategoryChart categories={categories} totalUnits={1234} />
        </div>
      </div>
    </main>
  );
}