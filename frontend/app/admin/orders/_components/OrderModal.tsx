"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Order } from "../page";
import { useState, useEffect } from "react";
import { X, Package, MapPin } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, "id">) => void;
  order?: Order;
}

export default function OrderModal({
  isOpen,
  onClose,
  onSave,
  order,
}: OrderModalProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    date: "",
    customer: "",
    customerEmail: "",
    total: 0,
    status: "Pending" as Order["status"],
    payment: "Pending" as Order["payment"],
    items: [] as Array<{ name: string; quantity: number; price: number }>,
    shippingAddress: "",
  });

  const [newItem, setNewItem] = useState({ name: "", quantity: 1, price: 0 });

  useEffect(() => {
    if (order) {
      setFormData({
        orderId: order.orderId,
        date: order.date,
        customer: order.customer,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        payment: order.payment,
        items: order.items || [],
        shippingAddress: order.shippingAddress || "",
      });
    } else {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      setFormData({
        orderId: `#ORD-${Math.floor(Math.random() * 10000)}`,
        date: formattedDate,
        customer: "",
        customerEmail: "",
        total: 0,
        status: "Pending",
        payment: "Pending",
        items: [],
        shippingAddress: "",
      });
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = formData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    onSave({ ...formData, total: calculatedTotal });
    onClose();
  };

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...newItem }],
      });
      setNewItem({ name: "", quantity: 1, price: 0 });
    }
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-sm shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {order ? "Edit Order" : "Add New Order"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.orderId}
                      onChange={(e) =>
                        setFormData({ ...formData, orderId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
                      readOnly
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Oct 24, 2023"
                    />
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer}
                      onChange={(e) =>
                        setFormData({ ...formData, customer: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="customer@example.com"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Order["status"],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Status *
                    </label>
                    <select
                      value={formData.payment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: e.target.value as Order["payment"],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Full shipping address..."
                  />
                </div>

                {/* Order Items */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Package size={14} className="inline mr-1" />
                    Order Items
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x Rs. {formatCurrency(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Product name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={addItem}
                          className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Order Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      Rs. {formatCurrency(
                        formData.items.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                  >
                    {order ? "Update Order" : "Create Order"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}