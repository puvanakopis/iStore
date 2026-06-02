"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import UsersTable from "./_components/UsersTable";
import UserModal from "./_components/UserModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Customer";
  spent: number;
  status: "Active" | "Blocked";
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    spent: 450000,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Customer",
    spent: 120000,
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "mike@example.com",
    role: "Customer",
    spent: 0,
    status: "Blocked",
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@example.com",
    role: "Customer",
    spent: 89000,
    status: "Active",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    role: "Customer",
    spent: 250000,
    status: "Active",
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userToDelete, setUserToDelete] = useState<User | undefined>();

  // No add user function - as requested
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...userData, id: selectedUser.id }
            : u
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(undefined);
    }
  };

  const handleUpdateStatus = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header - No Add User button */}
        <AdminHeader
          title="Community"
          subtitle="Manage your customers and administrative personnel"
          greeting="Manage your user community"
        />

        {/* Users Table */}
        <UsersTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Edit Modal - No add functionality */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          userName={userToDelete?.name}
        />
      </div>
    </main>
  );
}