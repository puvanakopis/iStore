"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock, ShieldCheck, User } from "lucide-react";
import { FormField } from "./FormField";
import { CheckoutFormData } from "../CheckoutPage";

interface PaymentMethodProps {
  formData: CheckoutFormData;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const PaymentMethod = ({ formData, onInputChange }: PaymentMethodProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-border rounded-sm p-6 md:p-8"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Payment Method</h3>
          <p className="text-sm text-foreground-secondary font-light">
            Secure payment with Credit / Debit Card
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
          <CreditCard size={20} />
        </div>
      </header>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Card Number"
            id="cardNumber"
            value={formData.cardNumber}
            icon={CreditCard}
            onChange={(value) => onInputChange("cardNumber", value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Expiry"
              id="expiry"
              value={formData.expiry}
              onChange={(value) => onInputChange("expiry", value)}
            />
            <FormField
              label="CVV"
              id="cvv"
              type="password"
              value={formData.cvv}
              onChange={(value) => onInputChange("cvv", value)}
            />
          </div>
        </div>
        <FormField
          label="Cardholder Name"
          id="cardholder"
          value={formData.cardholder}
          icon={User}
          onChange={(value) => onInputChange("cardholder", value)}
        />

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 pt-4 mt-2">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <Lock size={14} />
            <span>SSL Secure</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <ShieldCheck size={14} />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};