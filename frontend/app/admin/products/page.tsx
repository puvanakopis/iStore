"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTable from "./_components/ProductsTable";
import ProductModal from "./_components/ProductModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import { Plus } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { Product, ProductCreate, ProductUpdate } from "@/interfaces/product.interface";

export default function AdminProducts() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
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

  const handleSaveProduct = async (productData: ProductCreate | ProductUpdate) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData as ProductUpdate);
      } else {
        await createProduct(productData as ProductCreate);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setIsDeleteModalOpen(false);
        setProductToDelete(undefined);
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <AdminHeader
          title="Product Management"
          subtitle="Manage your product inventory, prices, and availability"
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

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm font-medium">Loading products...</p>
          </div>
        ) : (
          /* Products Table */
          <ProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        )}

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
          productName={productToDelete?.title}
        />
      </div>
    </main>
  );
}