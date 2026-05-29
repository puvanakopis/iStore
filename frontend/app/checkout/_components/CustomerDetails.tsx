"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import { FormField } from "./FormField";
import { CheckoutFormData } from "../CheckoutPage";

interface CustomerDetailsProps {
  formData: CheckoutFormData;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const CustomerDetails = ({ formData, onInputChange }: CustomerDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-border rounded-sm p-6 md:p-8"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Customer Details</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <User size={20} />
        </div>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            id="firstName"
            value={formData.firstName}
            icon={User}
            onChange={(value) => onInputChange("firstName", value)}
          />
          <FormField
            label="Last Name"
            id="lastName"
            value={formData.lastName}
            icon={User}
            onChange={(value) => onInputChange("lastName", value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            icon={Mail}
            onChange={(value) => onInputChange("email", value)}
          />
          <FormField
            label="Phone Number"
            id="phone"
            type="tel"
            value={formData.phone}
            icon={Phone}
            onChange={(value) => onInputChange("phone", value)}
          />
        </div>
      </div>
    </motion.div>
  );
};