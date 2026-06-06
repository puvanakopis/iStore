"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import UsersTable from "./_components/UsersTable";
import UserModal from "./_components/UserModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import { userService, AdminUser as User } from "@/services/user.service";

export type { User };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userToDelete, setUserToDelete] = useState<User | undefined>();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData: Omit<User, "id">) => {
    if (selectedUser) {
      try {
        const updated = await userService.update(selectedUser.id, userData);
        setUsers(users.map((u) => (u.id === selectedUser.id ? updated : u)));
      } catch (err: any) {
        alert(err.message || "Failed to update user");
      }
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.remove(userToDelete.id);
        setUsers(users.filter((u) => u.id !== userToDelete.id));
      } catch (err: any) {
        alert(err.message || "Failed to delete user");
      }
      setIsDeleteModalOpen(false);
      setUserToDelete(undefined);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: User["status"]) => {
    try {
      const updated = await userService.update(userId, { status: newStatus });
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header - No Add User button */}
        <AdminHeader
          title="Users Management"
          subtitle="Manage your customers and administrative personnel"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium animate-pulse">Loading users...</p>
          </div>
        ) : (
          /* Users Table */
          <UsersTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

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