"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, CheckCircle2, Home } from "lucide-react";
import { FormField } from "./FormField";
import { CheckoutFormData } from "../page";
import { useAuth } from "@/contexts/AuthContext";

interface ShippingAddressProps {
  formData: CheckoutFormData;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const ShippingAddress = ({ formData, onInputChange }: ShippingAddressProps) => {
  const { user, updateProfile } = useAuth();
  const [addressMode, setAddressMode] = useState<"saved" | "new">("new");
  const [saveToProfile, setSaveToProfile] = useState(false);

  const hasSavedAddress = Boolean(user && (user.address || user.city || user.state || user.zip_code || user.country));

  // Initialize mode: if user has a saved address, default to 'saved' mode and fill fields
  useEffect(() => {
    if (hasSavedAddress) {
      setAddressMode("saved");
      applySavedAddress();
    } else {
      setAddressMode("new");
    }
  }, [user]);

  const applySavedAddress = () => {
    if (!user) return;
    onInputChange("address", user.address || "");
    onInputChange("city", user.city || "");
    onInputChange("state", user.state || "");
    onInputChange("zipCode", user.zip_code || "");
    onInputChange("country", user.country || "");
  };

  const handleModeChange = (mode: "saved" | "new") => {
    setAddressMode(mode);
    if (mode === "saved") {
      applySavedAddress();
    } else {
      // Clear fields for entering new address
      onInputChange("address", "");
      onInputChange("city", "");
      onInputChange("state", "");
      onInputChange("zipCode", "");
      onInputChange("country", "");
    }
  };

  const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
    onInputChange(field, value);
    // If user modifies address in new mode and checked 'saveToProfile', update profile asynchronously
    if (saveToProfile && user) {
      const updatedFields: any = {};
      if (field === "address") updatedFields.address = value;
      if (field === "city") updatedFields.city = value;
      if (field === "state") updatedFields.state = value;
      if (field === "zipCode") updatedFields.zip_code = value;
      if (field === "country") updatedFields.country = value;
      updateProfile(updatedFields).catch(() => {});
    }
  };

  const handleSaveToProfileToggle = (checked: boolean) => {
    setSaveToProfile(checked);
    if (checked && user) {
      updateProfile({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
      }).catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-border rounded-sm p-6 md:p-8"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Shipping Address</h3>
          <p className="text-xs text-foreground-secondary font-light mt-0.5">
            Select a saved address or add a new shipping address
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <MapPin size={20} />
        </div>
      </header>

      {/* Address Selection Options */}
      {hasSavedAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Saved Address Option */}
          <div
            onClick={() => handleModeChange("saved")}
            className={`cursor-pointer p-4 rounded-sm border transition-all relative ${
              addressMode === "saved"
                ? "border-black bg-black/[0.02] shadow-sm"
                : "border-border hover:border-gray-400"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="addressSelection"
                  checked={addressMode === "saved"}
                  onChange={() => handleModeChange("saved")}
                  className="accent-black"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Home size={14} /> Saved Profile Address
                </span>
              </div>
              {addressMode === "saved" && (
                <CheckCircle2 size={16} className="text-black" />
              )}
            </div>

            <div className="pl-6 text-xs text-foreground-secondary space-y-0.5 leading-relaxed font-light">
              <p className="font-medium text-black">{user?.first_name} {user?.last_name}</p>
              {user?.address && <p>{user.address}</p>}
              <p>
                {[user?.city, user?.state, user?.zip_code].filter(Boolean).join(", ")}
              </p>
              {user?.country && <p>{user.country}</p>}
            </div>
          </div>

          {/* Add New Address Option */}
          <div
            onClick={() => handleModeChange("new")}
            className={`cursor-pointer p-4 rounded-sm border transition-all relative flex flex-col justify-between ${
              addressMode === "new"
                ? "border-black bg-black/[0.02] shadow-sm"
                : "border-border hover:border-gray-400"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="addressSelection"
                  checked={addressMode === "new"}
                  onChange={() => handleModeChange("new")}
                  className="accent-black"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Plus size={14} /> Add New Address
                </span>
              </div>
              <p className="pl-6 text-xs text-foreground-muted font-light">
                Enter a custom shipping destination for this order
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address Input Form */}
      {(addressMode === "new" || !hasSavedAddress) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <FormField
            label="Street Address"
            id="address"
            value={formData.address}
            icon={MapPin}
            onChange={(value) => handleFieldChange("address", value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="City"
              id="city"
              value={formData.city}
              onChange={(value) => handleFieldChange("city", value)}
            />
            <FormField
              label="State"
              id="state"
              value={formData.state}
              onChange={(value) => handleFieldChange("state", value)}
            />
            <FormField
              label="ZIP Code"
              id="zipCode"
              value={formData.zipCode}
              onChange={(value) => handleFieldChange("zipCode", value)}
            />
          </div>
          <FormField
            label="Country"
            id="country"
            value={formData.country}
            onChange={(value) => handleFieldChange("country", value)}
          />
        </motion.div>
      )}

      {/* Read-only view when saved address mode is active */}
      {addressMode === "saved" && hasSavedAddress && (
        <div className="p-4 bg-background-dim/50 rounded-sm border border-border/60 text-xs space-y-1">
          <p className="font-semibold text-black">Delivering to:</p>
          <p className="text-foreground-secondary">
            {[formData.address, formData.city, formData.state, formData.zipCode, formData.country]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </motion.div>
  );
};