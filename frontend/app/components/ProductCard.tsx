"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  title: string;
  price: string;
  oldPrice?: string;
  saveAmount?: string;
  images: string[];
  imageAlt: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  colors?: {
    name: string;
    hex: string;
    images: string[];
  }[];
}

export default function ProductCard({
  title,
  price,
  oldPrice,
  saveAmount,
  images: initialImages,
  imageAlt,
  badge,
  rating,
  reviewCount,
  colors,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImages = colors && colors.length > 0 
    ? colors[selectedColorIndex].images 
    : initialImages;

  const selectColor = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedColorIndex(index);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.1, 1] 
      }}
      className="group relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.02), 0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Smooth hover shadow overlay */}
      <motion.div 
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        animate={{ 
          opacity: isHovered ? 1 : 0
        }}
        initial={false}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.1, 1] }}
        style={{
          boxShadow: '0 30px 50px -20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.1, 1],
              opacity: { duration: 0.4 }
            }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImages[currentImageIndex]}
              alt={`${imageAlt} - ${colors ? colors[selectedColorIndex].name : ""} view ${currentImageIndex + 1}`}
              fill
              className="object-contain p-6 transition-all duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation Arrows - smoother */}
        {currentImages.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 0.8 : 0, x: isHovered ? 0 : -10 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-white shadow-md z-10"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 0.8 : 0, x: isHovered ? 0 : 10 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-white shadow-md z-10"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Smooth Image Indicators */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {currentImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className="relative h-1 rounded-full transition-all duration-300 overflow-hidden"
                style={{ width: index === currentImageIndex ? 24 : 6 }}
                initial={false}
                animate={{
                  backgroundColor: index === currentImageIndex ? '#000000' : 'rgba(0,0,0,0.2)',
                }}
                whileHover={{
                  backgroundColor: index === currentImageIndex ? '#000000' : 'rgba(0,0,0,0.4)',
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge - smoother */}
        {badge && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-5 left-5"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-black/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full shadow-sm">
              {badge}
            </span>
          </motion.div>
        )}

        {/* Save Amount Badge - smoother */}
        {saveAmount && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-5 right-5"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-green-500/10 backdrop-blur-md text-green-700 px-3.5 py-1.5 rounded-full shadow-sm">
              Save {saveAmount}
            </span>
          </motion.div>
        )}
      </div>

      {/* Content with smoother transitions */}
      <motion.div 
        className="p-6 space-y-3.5 bg-white relative z-10"
        initial={false}
        animate={{}}
      >
        {/* Title */}
        <h3 className="text-[17px] font-semibold tracking-tight text-black leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-gray-900">
          {title}
        </h3>

        {/* Rating - smoother stars */}
        {rating && reviewCount !== undefined && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <span className="text-[12px] font-light text-gray-400 transition-colors duration-300 group-hover:text-gray-500">
              ({reviewCount})
            </span>
          </motion.div>
        )}

        {/* Colors - smoother */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-gray-500">
              Colors
            </span>
            <div className="flex gap-2.5">
              {colors.map((color, index) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={(e) => selectColor(e, index)}
                  className={`w-6 h-6 rounded-full transition-all duration-300 ${
                    selectedColorIndex === index 
                      ? "ring-2 ring-black ring-offset-2 ring-offset-white scale-110" 
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-2 flex items-baseline gap-2.5 flex-wrap">
          <span className="text-[26px] font-semibold tracking-tight text-black transition-all duration-300 group-hover:tracking-tighter">
            {price}
          </span>
          {oldPrice && (
            <span className="text-[14px] text-gray-400 line-through font-light transition-colors duration-300 group-hover:text-gray-500">
              {oldPrice}
            </span>
          )}
        </div>

        {/* Shop Button - smoother */}
        <motion.button
          whileHover={{ scale: 0.97 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full mt-3 bg-black text-white rounded-full py-3.5 px-4 text-[14px] font-medium tracking-tight relative overflow-hidden group/btn"
        >
          <span className="relative z-10 transition-transform duration-300 inline-block group-hover/btn:scale-105">
            Shop now
          </span>
          <motion.div 
            className="absolute inset-0 bg-gray-800"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.1, 1] }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}