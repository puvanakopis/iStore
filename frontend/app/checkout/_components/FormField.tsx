"use client";

import { ElementType } from "react";

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
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors font-light text-[15px] peer"
        />
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 peer-focus:w-full" />
      </div>
    </div>
  );
};