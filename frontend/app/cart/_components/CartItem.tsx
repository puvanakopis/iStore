'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: {
    id: number | string;
    title: string;
    price: string;
    imageSrc: string;
    quantity: number;
    color?: string;
    storage?: string;
  };
  onUpdateQuantity: (id: number | string, delta: number) => void;
  onRemove: (id: number | string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b border-border group"
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 bg-background-dim rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground tracking-tight line-clamp-1">
            {item.title}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-foreground-muted hover:text-red-500 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-foreground-muted flex gap-3">
          {item.color && <span>Color: {item.color}</span>}
          {item.storage && <span>Storage: {item.storage}</span>}
        </div>
        <div className="mt-2 flex items-center justify-between sm:justify-start sm:gap-8">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border rounded-full p-1 bg-white">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="p-1 hover:bg-background-dim rounded-full transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="p-1 hover:bg-background-dim rounded-full transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          {/* Price */}
          <p className="text-base font-bold text-foreground">{item.price}</p>
        </div>
      </div>
    </motion.div>
  );
}