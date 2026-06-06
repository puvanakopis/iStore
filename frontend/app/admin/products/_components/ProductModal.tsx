"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductColor, ProductStorage, ProductFeature } from "@/interfaces/product.interface";
import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product?: Product;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    imageSrc: "",
    imageAlt: "",
    specifications: {
      finish: "",
      capacity: "",
      display: "",
      chip: "",
    },
    colors: [] as ProductColor[],
    storage: [] as ProductStorage[],
    features: [] as ProductFeature[],
    reviews: [] as any[],
  });

  // Temporary States for adding list items
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000", images: "" });
  const [newStorage, setNewStorage] = useState({ size: "", price: "" });
  const [newFeature, setNewFeature] = useState({ title: "", description: "", icon: "Smartphone" });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        subtitle: product.subtitle || "",
        price: product.price,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt || "",
        specifications: {
          finish: product.specifications?.finish || "",
          capacity: product.specifications?.capacity || "",
          display: product.specifications?.display || "",
          chip: product.specifications?.chip || "",
        },
        colors: product.colors || [],
        storage: product.storage || [],
        features: product.features || [],
        reviews: product.reviews || [],
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        price: "",
        imageSrc: "",
        imageAlt: "",
        specifications: {
          finish: "",
          capacity: "",
          display: "",
          chip: "",
        },
        colors: [],
        storage: [],
        features: [],
        reviews: [],
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // List Modification Handlers
  const addColor = () => {
    if (!newColor.name) return;
    const imagesArray = newColor.images
      ? newColor.images.split(",").map((img) => img.trim())
      : [];
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: newColor.name, hex: newColor.hex, images: imagesArray }],
    }));
    setNewColor({ name: "", hex: "#000000", images: "" });
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index),
    }));
  };

  const addStorage = () => {
    if (!newStorage.size || !newStorage.price) return;
    setFormData((prev) => ({
      ...prev,
      storage: [...prev.storage, { size: newStorage.size, price: newStorage.price }],
    }));
    setNewStorage({ size: "", price: "" });
  };

  const removeStorage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storage: prev.storage.filter((_, idx) => idx !== index),
    }));
  };

  const addFeature = () => {
    if (!newFeature.title || !newFeature.description) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
    setNewFeature({ title: "", description: "", icon: "Smartphone" });
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-sm shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {product ? "Edit Product" : "Add New Product"}
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">
                
                {/* 1. Basic Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100">
                    1. Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., iPhone 15 Pro Max"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Titanium. So strong. So light. So Pro."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Base Price *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Rs. 249,900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Image Source URL *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.imageSrc}
                        onChange={(e) =>
                          setFormData({ ...formData, imageSrc: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., /images/iphone15promax.png"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.imageAlt}
                        onChange={(e) =>
                          setFormData({ ...formData, imageAlt: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., iPhone 15 Pro Max in Natural Titanium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Technical Specifications */}
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100">
                    2. Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Finish
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.finish}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, finish: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Natural Titanium, Blue Titanium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Capacity
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, capacity: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., 256GB, 512GB, 1TB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Display Info
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.display}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, display: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., 6.7-inch Super Retina XDR display"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Processor / Chip
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.chip}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, chip: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., A17 Pro chip"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Product Colors */}
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100">
                    3. Product Colors ({formData.colors.length})
                  </h3>
                  
                  {/* Current Colors list */}
                  <div className="flex flex-col gap-2 mb-4">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                          <div>
                            <p className="font-semibold text-gray-900">{color.name}</p>
                            <p className="text-xs text-gray-500">{color.hex} | {color.images.length} images</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Color Sub-form */}
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/30 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Color Name</label>
                      <input
                        type="text"
                        value={newColor.name}
                        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Natural Titanium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Color Hex Code</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                          className="w-10 h-8 border border-gray-200 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="#aabbcc"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URLs (comma-separated)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newColor.images}
                          onChange={(e) => setNewColor({ ...newColor, images: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="/img1.png, /img2.png"
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Storage Variants */}
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100">
                    4. Storage Options ({formData.storage.length})
                  </h3>

                  {/* Current Storage list */}
                  <div className="flex flex-col gap-2 mb-4">
                    {formData.storage.map((st, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">{st.size}</p>
                          <p className="text-xs text-gray-500">Price: {st.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStorage(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Storage Sub-form */}
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/30 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Size</label>
                      <input
                        type="text"
                        value={newStorage.size}
                        onChange={(e) => setNewStorage({ ...newStorage, size: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., 256GB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                      <input
                        type="text"
                        value={newStorage.price}
                        onChange={(e) => setNewStorage({ ...newStorage, price: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Rs. 249,900"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addStorage}
                        className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                      >
                        <Plus size={16} /> Add Storage
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Product Features */}
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-4 pb-2 border-b border-gray-100">
                    5. Key Features ({formData.features.length})
                  </h3>

                  {/* Current Features list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm relative">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{feature.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono mt-2 inline-block">
                            Icon: {feature.icon}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Feature Sub-form */}
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/30 grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Feature Title</label>
                        <input
                          type="text"
                          value={newFeature.title}
                          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="e.g., A17 Pro Chip"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Icon Name (Lucide)</label>
                        <input
                          type="text"
                          value={newFeature.icon}
                          onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="Smartphone / Cpu / Camera"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={newFeature.description}
                          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                          placeholder="Describe this feature..."
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-medium"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                  >
                    {product ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}