"use client";

import { motion } from "framer-motion";
import { Product } from "@/interfaces/product.interface";
import { Edit, Trash2, Package, Search } from "lucide-react";
import { useState } from "react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({ 
  products, 
  onEdit, 
  onDelete 
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subtitle && product.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.specifications?.chip && product.specifications.chip.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

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
              placeholder="Search by title, subtitle, chip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
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
                Specifications
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Colors
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Storage
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
                  <div className="flex items-center gap-4">
                    {product.imageSrc && (
                      <img 
                        src={product.imageSrc} 
                        alt={product.imageAlt || product.title} 
                        className="w-12 h-12 object-contain bg-gray-50 rounded p-1"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{product.title}</p>
                      {product.subtitle && (
                        <p className="text-xs text-gray-500 mt-0.5">{product.subtitle}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="space-y-0.5">
                    {product.specifications?.chip && (
                      <p><span className="font-medium">Chip:</span> {product.specifications.chip}</p>
                    )}
                    {product.specifications?.display && (
                      <p><span className="font-medium">Display:</span> {product.specifications.display}</p>
                    )}
                    {product.specifications?.capacity && (
                      <p><span className="font-medium">Cap:</span> {product.specifications.capacity}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    {product.price}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                    {product.colors && product.colors.length > 0 ? (
                      product.colors.map((color, idx) => (
                        <div 
                          key={idx}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.storage && product.storage.length > 0 ? (
                      product.storage.map((st, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium"
                        >
                          {st.size}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
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