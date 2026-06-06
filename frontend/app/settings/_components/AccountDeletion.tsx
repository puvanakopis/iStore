"use client";

import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";

export default function AccountDeletion() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to delete your account.");
      return;
    }

    if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setError("The email entered does not match your registered email address.");
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount(confirmEmail.trim());
      // Log out user & redirect to signin
      logout();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete account. Please try again later.");
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-red-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-red-600">
            Danger Zone
          </h3>
          <p className="text-sm text-foreground-secondary font-light">
            Permanently delete your account and all data
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
          <AlertTriangle size={20} />
        </div>
      </header>

      <div className="space-y-6">
        <p className="text-sm text-foreground-secondary font-light">
          Once you delete your account, there is no going back. Please be
          certain. All your orders, wishlist, and personal data will be wiped
          from our servers.
        </p>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
            {error}
          </div>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-200 text-red-600 px-8 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        ) : (
          <form onSubmit={handleDelete} className="space-y-4 p-6 bg-red-50 rounded-sm border border-red-100">
            <p className="text-sm font-medium text-red-800">
              Are you absolutely sure? Type your email to confirm deletion.
            </p>

            <input
              type="email"
              required
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={user?.email || "your.email@example.com"}
              className="w-full bg-white border border-red-200 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-red-500/20 text-sm text-black"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmEmail("");
                  setError(null);
                }}
                className="bg-white border border-border px-6 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isDeleting}
                className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}