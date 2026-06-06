"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { FormField } from "./FormField";
import { CheckoutFormData } from "../page";

interface ShippingAddressProps {
  formData: CheckoutFormData;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const ShippingAddress = ({ formData, onInputChange }: ShippingAddressProps) => {
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
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <MapPin size={20} />
        </div>
      </header>

      <div className="space-y-6">
        <FormField
          label="Street Address"
          id="address"
          value={formData.address}
          icon={MapPin}
          onChange={(value) => onInputChange("address", value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="City"
            id="city"
            value={formData.city}
            onChange={(value) => onInputChange("city", value)}
          />
          <FormField
            label="State"
            id="state"
            value={formData.state}
            onChange={(value) => onInputChange("state", value)}
          />
          <FormField
            label="ZIP Code"
            id="zipCode"
            value={formData.zipCode}
            onChange={(value) => onInputChange("zipCode", value)}
          />
        </div>
        <FormField
          label="Country"
          id="country"
          value={formData.country}
          onChange={(value) => onInputChange("country", value)}
        />
      </div>
    </motion.div>
  );
};