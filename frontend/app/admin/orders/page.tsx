"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "./_components/OrdersTable";
import OrderModal from "./_components/OrderModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import api from "../../../services/api";

export interface Order {
  id: string;
  user_id?: string;
  customer_details: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    product_id: string;
    title: string;
    price: string;
    imageSrc: string;
    color: string;
    storage: string;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promo_code?: string | null;
  status: "Delivered" | "Processing" | "Pending" | "Cancelled" | "Shipped";
  payment: "Paid" | "Failed" | "Refunded" | "Pending";
  created_at?: string;
  updated_at?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [orderToDelete, setOrderToDelete] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleSaveOrder = async (orderData: Omit<Order, "id">) => {
    if (!selectedOrder) return;
    try {
      await api.put(`/orders/${selectedOrder.id}`, orderData);
      fetchOrders();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please check console.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await api.delete(`/orders/${orderToDelete.id}`);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
      } finally {
        setIsDeleteModalOpen(false);
        setOrderToDelete(undefined);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdatePayment = async (orderId: string, newPayment: Order["payment"]) => {
    try {
      await api.put(`/orders/${orderId}`, { payment: newPayment });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, payment: newPayment } : o)));
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <AdminHeader
          title="Order Management"
          subtitle="Monitor and process customer orders across your store"
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-gray-900/10 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          /* Orders Table */
          <OrdersTable
            orders={orders}
            onEdit={handleEditOrder}
            onDelete={handleDeleteClick}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePayment={handleUpdatePayment}
          />
        )}

        {/* Add/Edit Modal */}
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOrder}
          order={selectedOrder}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          orderId={orderToDelete?.id}
        />
      </div>
    </main>
  );
}