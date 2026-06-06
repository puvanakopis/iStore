"use client";

import { motion } from "framer-motion";
import { User as UserIcon, MapPin, Save, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function PersonalDetailsForm() {
  const { user, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        address: address,
        phone: phone,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border h-full shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Personal Details</h3>
          <p className="text-sm text-foreground-secondary font-light">Manage your information</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <UserIcon size={20} />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] opacity-50 cursor-not-allowed"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
              />
              <Phone size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1" htmlFor="address">
            Default Address
          </label>
          <div className="relative">
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] pr-8"
            />
            <MapPin size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted" />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
          {success && (
            <span className="text-sm text-green-600 font-medium animate-fade-in">
              Changes saved successfully!
            </span>
          )}
        </div>
      </form>
    </motion.div>
  );
}
