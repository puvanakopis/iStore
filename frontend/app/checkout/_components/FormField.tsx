"use client";

import { ElementType, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  required?: boolean;
  icon?: ElementType;
  onChange: (value: string) => void;
}

export const FormField = ({
  label,
  id,
  type = "text",
  value,
  required = true,
  icon: Icon,
  onChange,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="flex flex-col group">
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-widest text-foreground-muted font-medium mb-1 flex items-center gap-1"
      >
        {Icon && <Icon size={12} />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] peer ${
            isPasswordField ? "pr-8" : ""
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 peer-focus:w-full" />
      </div>
    </div>
  );
};