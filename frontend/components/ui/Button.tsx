"use client";

import React from "react";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    className?: string;
}

export default function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "relative inline-flex items-center justify-center rounded-[14px] font-medium transition-all duration-300 active:scale-[0.97] disabled:opacity-50";

    const sizes = {
        sm: "px-5 py-2 text-[13px]",
        md: "px-10 py-4 text-[15px]",
        lg: "px-12 py-5 text-[17px]",
    };

    const variants = {
        primary:
            "bg-black text-white border border-transparent hover:bg-zinc-800",
        outline:
            "border border-black text-black bg-transparent hover:bg-black/5",
    };

    return (
        <button
            {...props}
            className={`
                ${baseStyles}
                ${sizes[size]}
                ${variants[variant]}
                ${className}
            `}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </button>
    );
}