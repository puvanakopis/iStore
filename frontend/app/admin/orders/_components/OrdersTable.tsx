"use client";

import { motion } from "framer-motion";
import { Order } from "../page";
import { Eye, Download, Edit, Trash2, Search, Filter, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onUpdatePayment: (orderId: string, payment: Order["payment"]) => void;
}

export default function OrdersTable({ 
  orders, 
  onEdit, 
  onDelete, 
  onUpdateStatus,
  onUpdatePayment
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");

  const statuses = ["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const payments = ["all", "Pending", "Paid", "Failed", "Refunded"];

  const filteredOrders = (orders || []).filter(order => {
    const orderId = (order.id || "").toLowerCase();
    const customerName = `${order.customer_details?.firstName || ""} ${order.customer_details?.lastName || ""}`.toLowerCase();
    const customerEmail = (order.customer_details?.email || "").toLowerCase();

    const matchesSearch = orderId.includes(searchTerm.toLowerCase()) ||
                          customerName.includes(searchTerm.toLowerCase()) ||
                          customerEmail.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPayment = filterPayment === "all" || order.payment === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-600 border-green-100";
      case "Processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getPaymentColor = (payment: Order["payment"]) => {
    switch (payment) {
      case "Paid":
        return "bg-green-50 text-green-600 border-green-100";
      case "Pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Failed":
        return "bg-red-50 text-red-600 border-red-100";
      case "Refunded":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const handleViewDetails = (order: Order) => {
    console.log("View order details:", order);
  };

  const handleDownloadInvoice = (order: Order) => {
    console.log("Download invoice:", order);
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
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-3">
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
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Payment Filter */}
            <div className="relative">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm appearance-none bg-white"
              >
                {payments.map(payment => (
                  <option key={payment} value={payment}>
                    {payment === "all" ? "All Payments" : payment}
                  </option>
                ))}
              </select>
              <ShoppingBag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                Order ID
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">#{order.id.toUpperCase()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {`${order.customer_details?.firstName || ""} ${order.customer_details?.lastName || ""}`.trim() || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.customer_details?.email || ""}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900">
                    Rs. {formatCurrency(order.total)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as Order["status"])}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} border cursor-pointer focus:ring-2 focus:ring-gray-900`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.payment}
                    onChange={(e) => onUpdatePayment(order.id, e.target.value as Order["payment"])}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.payment)} border cursor-pointer focus:ring-2 focus:ring-gray-900`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Download Invoice"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Edit Order"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(order)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete Order"
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
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <span className="text-gray-500">
            Total Value: Rs. {formatCurrency((orders || []).reduce((sum, order) => sum + order.total, 0))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}