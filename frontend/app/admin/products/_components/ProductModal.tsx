"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductColor, ProductStorage, ProductFeature } from "@/interfaces/product.interface";
import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, Edit } from "lucide-react";
import { productService } from "@/services/product.service";

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
  // Temporary States for adding list items
  const [newColor, setNewColor] = useState<{ name: string; hex: string; images: string[] }>({ name: "", hex: "#000000", images: [] });
  const [newStorage, setNewStorage] = useState({ size: "", price: "" });
  const [newFeature, setNewFeature] = useState({ title: "", description: "", icon: "Smartphone" });

  const [isColorUploading, setIsColorUploading] = useState(false);
  const [colorUploadError, setColorUploadError] = useState<string | null>(null);

  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [editingStorageIndex, setEditingStorageIndex] = useState<number | null>(null);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);


  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await productService.upload(file);
      setFormData((prev) => ({
        ...prev,
        imageSrc: result.url,
      }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleColorFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsColorUploading(true);
    setColorUploadError(null);
    try {
      const uploadPromises = Array.from(files).map((file) => productService.upload(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((res) => res.url);
      setNewColor((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err: any) {
      setColorUploadError(err.message || "Failed to upload color images");
      console.error(err);
    } finally {
      setIsColorUploading(false);
    }
  };



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
    if (!formData.imageSrc) {
      setUploadError("Product image is required");
      return;
    }
    onSave(formData);
    onClose();
  };

  // List Modification Handlers
  const addColor = () => {
    if (!newColor.name) return;
    setFormData((prev) => {
      let updatedColors = [...prev.colors];
      if (editingColorIndex !== null) {
        updatedColors[editingColorIndex] = { name: newColor.name, hex: newColor.hex, images: newColor.images };
      } else {
        updatedColors.push({ name: newColor.name, hex: newColor.hex, images: newColor.images });
      }
      return { ...prev, colors: updatedColors };
    });
    setNewColor({ name: "", hex: "#000000", images: [] });
    setEditingColorIndex(null);
  };

  const startEditColor = (index: number) => {
    const color = formData.colors[index];
    setNewColor({ name: color.name, hex: color.hex, images: color.images || [] });
    setEditingColorIndex(index);
  };

  const cancelEditColor = () => {
    setNewColor({ name: "", hex: "#000000", images: [] });
    setEditingColorIndex(null);
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index),
    }));
    if (editingColorIndex === index) {
      cancelEditColor();
    }
  };

  const addStorage = () => {
    if (!newStorage.size || !newStorage.price) return;
    setFormData((prev) => {
      let updatedStorage = [...prev.storage];
      if (editingStorageIndex !== null) {
        updatedStorage[editingStorageIndex] = { size: newStorage.size, price: newStorage.price };
      } else {
        updatedStorage.push({ size: newStorage.size, price: newStorage.price });
      }
      return { ...prev, storage: updatedStorage };
    });
    setNewStorage({ size: "", price: "" });
    setEditingStorageIndex(null);
  };

  const startEditStorage = (index: number) => {
    const st = formData.storage[index];
    setNewStorage({ size: st.size, price: st.price });
    setEditingStorageIndex(index);
  };

  const cancelEditStorage = () => {
    setNewStorage({ size: "", price: "" });
    setEditingStorageIndex(null);
  };

  const removeStorage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storage: prev.storage.filter((_, idx) => idx !== index),
    }));
    if (editingStorageIndex === index) {
      cancelEditStorage();
    }
  };

  const addFeature = () => {
    if (!newFeature.title || !newFeature.description) return;
    setFormData((prev) => {
      let updatedFeatures = [...prev.features];
      if (editingFeatureIndex !== null) {
        updatedFeatures[editingFeatureIndex] = newFeature;
      } else {
        updatedFeatures.push(newFeature);
      }
      return { ...prev, features: updatedFeatures };
    });
    setNewFeature({ title: "", description: "", icon: "Smartphone" });
    setEditingFeatureIndex(null);
  };

  const startEditFeature = (index: number) => {
    const f = formData.features[index];
    setNewFeature({ title: f.title, description: f.description, icon: f.icon || "Smartphone" });
    setEditingFeatureIndex(index);
  };

  const cancelEditFeature = () => {
    setNewFeature({ title: "", description: "", icon: "Smartphone" });
    setEditingFeatureIndex(null);
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
    if (editingFeatureIndex === index) {
      cancelEditFeature();
    }
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

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Image *
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors relative bg-gray-50/20">
                        <div className="space-y-1 text-center w-full">
                          {formData.imageSrc ? (
                            <div className="relative inline-block">
                              <img
                                src={formData.imageSrc}
                                alt="Preview"
                                className="mx-auto h-32 w-auto object-contain rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, imageSrc: "" })}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-semibold text-gray-900 hover:text-gray-800 focus-within:outline-none"
                                >
                                  <span className="underline">Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                              <p className="text-xs font-semibold text-gray-900 mt-2">Uploading image...</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {uploadError && (
                        <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                      )}

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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditColor(index)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                            title="Edit Color"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Color"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Color Sub-form */}
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/30 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Color Images</label>
                      <div className="mt-1 flex flex-col gap-3">
                        {/* Selected images preview list */}
                        {newColor.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-gray-100">
                            {newColor.images.map((img, idx) => (
                              <div key={idx} className="relative w-16 h-16 border border-gray-200 rounded bg-gray-50 flex items-center justify-center p-1">
                                <img src={img} alt="preview" className="max-w-full max-h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewColor((prev) => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 shadow"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label
                              htmlFor="color-files-upload"
                              className="relative cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white text-sm font-semibold text-gray-700"
                            >
                              <Upload size={16} />
                              <span>{isColorUploading ? "Uploading..." : "Upload Color Images"}</span>
                              <input
                                id="color-files-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                onChange={handleColorFilesChange}
                                disabled={isColorUploading}
                              />
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={addColor}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm h-[40px] flex items-center justify-center gap-1"
                          >
                            {editingColorIndex !== null ? <Edit size={16} /> : <Plus size={16} />}
                            {editingColorIndex !== null ? "Update Color" : "Add Color"}
                          </button>
                          {editingColorIndex !== null && (
                            <button
                              type="button"
                              onClick={cancelEditColor}
                              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm h-[40px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {colorUploadError && (
                          <p className="text-xs text-red-600 mt-1">{colorUploadError}</p>
                        )}
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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditStorage(index)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                            title="Edit Storage"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStorage(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Storage"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addStorage}
                          className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                        >
                          {editingStorageIndex !== null ? <Edit size={16} /> : <Plus size={16} />}
                          {editingStorageIndex !== null ? "Update" : "Add Storage"}
                        </button>
                        {editingStorageIndex !== null && (
                          <button
                            type="button"
                            onClick={cancelEditStorage}
                            className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
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