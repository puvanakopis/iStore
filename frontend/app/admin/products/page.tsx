"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTable from "./_components/ProductsTable";
import ProductModal from "./_components/ProductModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image?: string;
  description?: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 249900,
    stock: 45,
    status: "In Stock",
    description: "Latest iPhone with A17 Pro chip",
  },
  {
    id: "2",
    name: "AirPods Pro 2",
    price: 24900,
    stock: 8,
    status: "Low Stock",
    description: "Active Noise Cancellation",
  },
  {
    id: "3",
    name: "Apple Watch Ultra 2",
    price: 89900,
    stock: 0,
    status: "Out of Stock",
    description: "Titanium case, 49mm",
  },
  {
    id: "4",
    name: "MacBook Pro M3",
    price: 199900,
    stock: 15,
    status: "In Stock",
    description: "14-inch, 512GB SSD",
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | undefined>();

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, "id">) => {
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? { ...productData, id: selectedProduct.id }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(undefined);
    }
  };

  const handleUpdateStatus = (
    productId: string,
    newStatus: Product["status"]
  ) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <AdminHeader
          title="Product Management"
          subtitle="Manage your product inventory, prices, and availability"
          greeting="Manage your product catalog"
          actions={
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
            >
              <Plus size={18} />
              Add Product
            </button>
          }
        />

        {/* Products Table */}
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Add/Edit Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={selectedProduct}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          productName={productToDelete?.name}
        />
      </div>
    </main>
  );
}