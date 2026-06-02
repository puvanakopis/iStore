"use client";

import { motion } from "framer-motion";
import { Product } from "../page";
import { Edit, Trash2, Package, Search, Filter } from "lucide-react";
import { useState } from "react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStatus: (productId: string, status: Product["status"]) => void;
}

export default function ProductsTable({ 
  products, 
  onEdit, 
  onDelete, 
  onUpdateStatus 
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const categories = ["all", "iPhone", "Accessories", "Apple Watch", "MacBook"];
  const statuses = ["all", "In Stock", "Low Stock", "Out of Stock"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesStatus = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-green-50 text-green-600";
      case "Low Stock":
        return "bg-yellow-50 text-yellow-600";
      case "Out of Stock":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="bg-white rounded-sm border border-border overflow-hidden"
    >
      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm appearance-none bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </option>
                ))}
              </select>
              <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{product.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    product.stock === 0 ? "text-red-600" : 
                    product.stock < 10 ? "text-yellow-600" : 
                    "text-gray-900"
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={product.status}
                    onChange={(e) => onUpdateStatus(product.id, e.target.value as Product["status"])}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)} border-0 cursor-pointer focus:ring-2 focus:ring-gray-900`}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>
    </motion.div>
  );
}