'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageProps {
    images: string[];
    productName: string;
}

export default function ProductImage({ images, productName }: ProductImageProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        setSelectedImage(0);
    }, [images]);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] mx-auto rounded-sm overflow-hidden bg-gray-50/50 group cursor-zoom-in border border-border/50"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        alt={productName}
                        className={`w-full h-full object-contain transition-transform duration-700 ease-out ${isZoomed ? 'scale-110' : 'scale-100'
                            }`}
                        src={images[selectedImage]}
                    />
                </AnimatePresence>
            </motion.div>

            <div className="flex flex-wrap gap-3 pb-2 pt-2 max-w-[450px] mx-auto">
                {images.map((image, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-sm border-2 transition-all duration-300 overflow-hidden bg-gray-50 ${selectedImage === index
                                ? 'border-primary'
                                : 'border-transparent hover:border-gray-200'
                            }`}
                        onClick={() => setSelectedImage(index)}
                    >
                        <img className="w-full h-full object-contain p-2" src={image} alt={`${productName} view ${index + 1}`} />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}