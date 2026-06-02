"use client";

import { motion } from "framer-motion";
import { User } from "../page";
import { Edit, Trash2, Users, Search, Filter, Shield, Mail } from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onUpdateStatus: (userId: string, status: User["status"]) => void;
}

export default function UsersTable({ 
  users, 
  onEdit, 
  onDelete, 
  onUpdateStatus 
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const roles = ["all", "Admin", "Customer"];
  const statuses = ["all", "Active", "Blocked"];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600";
      case "Blocked":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const formatSpent = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-3">
            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm appearance-none bg-white"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </option>
                ))}
              </select>
              <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                User
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Spent
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
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.role === "Admin" && <Shield size={14} className="text-gray-700" />}
                    <span className={`text-sm font-medium ${
                      user.role === "Admin" ? "text-gray-900" : "text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    Rs. {formatSpent(user.spent)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.status}
                    onChange={(e) => onUpdateStatus(user.id, e.target.value as User["status"])}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)} border-0 cursor-pointer focus:ring-2 focus:ring-gray-900`}
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 font-medium">No users found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>
    </motion.div>
  );
}