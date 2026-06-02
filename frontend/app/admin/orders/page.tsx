"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "./_components/OrdersTable";
import OrderModal from "./_components/OrderModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import { Plus } from "lucide-react";

export interface Order {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: "Delivered" | "Processing" | "Pending" | "Cancelled" | "Shipped";
  payment: "Paid" | "Failed" | "Refunded" | "Pending";
  items?: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "#ORD-7721",
    date: "Oct 24, 2023",
    customer: "John Doe",
    customerEmail: "john@example.com",
    total: 320000,
    status: "Delivered",
    payment: "Paid",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 249900 },
      { name: "AirPods Pro 2", quantity: 1, price: 24900 },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "2",
    orderId: "#ORD-7722",
    date: "Oct 25, 2023",
    customer: "Sarah Smith",
    customerEmail: "sarah@example.com",
    total: 120000,
    status: "Processing",
    payment: "Paid",
    items: [
      { name: "Apple Watch Ultra 2", quantity: 1, price: 89900 },
      { name: "AirPods Pro 2", quantity: 1, price: 24900 },
    ],
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: "3",
    orderId: "#ORD-7723",
    date: "Oct 25, 2023",
    customer: "Michael Chen",
    customerEmail: "mike@example.com",
    total: 65000,
    status: "Pending",
    payment: "Failed",
    items: [
      { name: "MacBook Pro M3", quantity: 1, price: 199900 },
    ],
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: "4",
    orderId: "#ORD-7724",
    date: "Oct 26, 2023",
    customer: "Emily Brown",
    customerEmail: "emily@example.com",
    total: 89900,
    status: "Shipped",
    payment: "Paid",
    items: [
      { name: "Apple Watch Ultra 2", quantity: 1, price: 89900 },
    ],
    shippingAddress: "321 Elm St, Houston, TX 77001",
  },
  {
    id: "5",
    orderId: "#ORD-7725",
    date: "Oct 26, 2023",
    customer: "David Wilson",
    customerEmail: "david@example.com",
    total: 49900,
    status: "Cancelled",
    payment: "Refunded",
    items: [
      { name: "AirPods Pro 2", quantity: 2, price: 24900 },
    ],
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [orderToDelete, setOrderToDelete] = useState<Order | undefined>();

  const handleAddOrder = () => {
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleSaveOrder = (orderData: Omit<Order, "id">) => {
    if (selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id
            ? { ...orderData, id: selectedOrder.id }
            : o
        )
      );
    } else {
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        orderId: `#ORD-${Math.floor(Math.random() * 10000)}`,
      };
      setOrders([...orders, newOrder]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter((o) => o.id !== orderToDelete.id));
      setIsDeleteModalOpen(false);
      setOrderToDelete(undefined);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  const handleUpdatePayment = (orderId: string, newPayment: Order["payment"]) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, payment: newPayment } : o
      )
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <AdminHeader
          title="Fulfillment"
          subtitle="Monitor and process customer orders across your store"
          greeting="Manage your orders"
          actions={
            <button
              onClick={handleAddOrder}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
            >
              <Plus size={18} />
              Add Order
            </button>
          }
        />

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePayment={handleUpdatePayment}
        />

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
          orderId={orderToDelete?.orderId}
        />
      </div>
    </main>
  );
}