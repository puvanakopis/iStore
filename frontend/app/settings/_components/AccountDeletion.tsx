"use client";

import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function AccountDeletion() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-200 text-red-600 px-8 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        ) : (
          <div className="space-y-4 p-6 bg-red-50 rounded-sm border border-red-100">
            <p className="text-sm font-medium text-red-800">
              Are you absolutely sure? Type your email to confirm deletion.
            </p>

            <input
              type="text"
              placeholder="john.doe@icloud.com"
              className="w-full bg-white border border-red-200 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-red-500/20 text-sm"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white border border-border px-6 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-all"
              >
                Cancel
              </button>

              <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-all">
                Confirm Deletion
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}