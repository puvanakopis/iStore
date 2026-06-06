'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Heart, Truck, RotateCcw, Cpu, Camera, Zap, ShieldCheck, Share2, Box } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
    id: string;
    name: string;
    tagline: string;
    price: string;
    rating?: number;
    reviewCount?: number;
    colors: Array<{ name: string; value: string; images?: string[] }>;
    storage: Array<{ size: string; price: string }>;
    features: Array<{ icon: string; title: string; description: string }>;
    specifications: Array<{ label: string; value: string }>;
    reviews: Array<{ rating: number; text: string; author: string }>;
}

interface ProductDetailsProps {
    product: Product;
    selectedColor: string;
    onColorSelect: (colorName: string) => void;
}

type TabType = 'description' | 'specifications' | 'reviews';

export default function ProductDetails({ product, selectedColor, onColorSelect }: ProductDetailsProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [activeTab, setActiveTab] = useState<TabType>('description');
    const [selectedStorage, setSelectedStorage] = useState(product.storage[0].size);
    const [quantity, setQuantity] = useState(1);

    const getFeatureIcon = (icon: string) => {
        switch (icon) {
            case 'rocket_launch': return <Cpu className="w-8 h-8 text-primary" />;
            case 'photo_camera': return <Camera className="w-8 h-8 text-primary" />;
            case 'bolt': return <Zap className="w-8 h-8 text-primary" />;
            default: return null;
        }
    };

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleColorSelect = (colorName: string) => {
        onColorSelect(colorName);
    };

    const handleStorageSelect = (storageSize: string) => {
        setSelectedStorage(storageSize);
    };

    const handleAddToBag = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        const currentPrice = product.storage.find(s => s.size === selectedStorage)?.price || product.price;

        const activeColorObj = product.colors.find(c => c.name === selectedColor);
        const imageSrc = (activeColorObj?.images && activeColorObj.images.length > 0)
            ? activeColorObj.images[0]
            : product.imageSrc;

        try {
            await addToCart(
                product.id,
                quantity,
                selectedColor,
                selectedStorage,
                product.name,
                currentPrice,
                imageSrc
            );
            router.push('/cart');
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavorite = () => {
        console.log('Added to favorites:', product.name);
        // Add your favorites logic here
    };

    const selectedStoragePrice = product.storage.find(s => s.size === selectedStorage)?.price || product.price;

    return (
        <div className="flex flex-col justify-start space-y-10">
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter">New Arrival</span>
                    <button className="p-2 hover:bg-background-dim rounded-sm transition-colors text-foreground-muted hover:text-primary">
                        <Share2 size={20} />
                    </button>
                </div>
                <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-foreground leading-[1.1]">{product.name}</h1>

                <div className="flex items-center gap-4">
                    <StarRating rating={product.rating || 0} size={18} />
                    <span className="text-sm font-medium text-foreground-muted">
                        ({product.reviewCount || 0} reviews)
                    </span>
                </div>

                <p className="text-foreground-secondary text-lg font-light tracking-tight leading-relaxed max-w-md">{product.tagline}</p>
                <div className="flex items-baseline gap-2 mt-4">
                    <p className="text-4xl font-bold text-foreground">{selectedStoragePrice}</p>
                    <span className="text-foreground-muted text-sm font-light">or Rs. 8,325/mo. for 12 mo.*</span>
                </div>
            </motion.header>

            {/* Color Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-4"
            >
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Finish. <span className="text-foreground-muted font-normal normal-case tracking-normal ml-2">{selectedColor}</span>
                </h3>
                <div className="flex gap-4">
                    {product.colors.map((color) => (
                        <button
                            key={color.name}
                            className={`w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border-2 ${selectedColor === color.name
                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                : 'border-border'
                                }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorSelect(color.name)}
                            title={color.name}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Storage Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
            >
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Storage. <span className="text-foreground-muted font-normal normal-case tracking-normal ml-2">How much space do you need?</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {product.storage.map((storage) => (
                        <button
                            key={storage.size}
                            className={`px-5 py-2 rounded-sm border transition-all duration-300 text-left active:scale-[0.98] ${selectedStorage === storage.size
                                ? 'border-primary bg-background-dim'
                                : 'border-border hover:border-primary'
                                }`}
                            onClick={() => handleStorageSelect(storage.size)}
                        >
                            <span className="block font-bold text-foreground">{storage.size}</span>
                            <span className="text-foreground-muted text-sm tracking-tight">From {storage.price}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Action Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center gap-4 pt-6"
            >
                <div className="flex items-center border border-border rounded-full px-3 py-1 bg-white">
                    <button
                        className="p-2 hover:text-primary transition-colors hover:bg-background-dim rounded-full"
                        onClick={decrementQty}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="px-4 font-bold w-10 text-center">{quantity}</span>
                    <button
                        className="p-2 hover:text-primary transition-colors hover:bg-background-dim rounded-full"
                        onClick={incrementQty}
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <button
                    className="flex-grow bg-primary text-white py-4 rounded-full font-bold hover:translate-y-[-2px] active:scale-95 transition-all duration-300"
                    onClick={handleAddToBag}
                >
                    Add to Bag
                </button>
                <button
                    className="p-4 border border-border rounded-full hover:bg-background-dim transition-all duration-300 hover:scale-110 group"
                    onClick={handleFavorite}
                >
                    <Heart className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" size={24} />
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 gap-y-4 gap-x-6 pt-8 border-t border-border"
            >
                <div className="flex items-center gap-3 text-sm text-foreground-secondary group cursor-default">
                    <div className="p-2 bg-background-dim rounded-lg group-hover:bg-primary/5 transition-colors">
                        <Truck size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">Free Shipping</span>
                        <span className="text-xs text-foreground-muted">On orders over Rs. 150,000</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground-secondary group cursor-default">
                    <div className="p-2 bg-background-dim rounded-lg group-hover:bg-primary/5 transition-colors">
                        <RotateCcw size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">Easy Returns</span>
                        <span className="text-xs text-foreground-muted">14-day return period</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground-secondary group cursor-default">
                    <div className="p-2 bg-background-dim rounded-lg group-hover:bg-primary/5 transition-colors">
                        <ShieldCheck size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">2 Year Warranty</span>
                        <span className="text-xs text-foreground-muted">Apple Care+ available</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground-secondary group cursor-default">
                    <div className="p-2 bg-background-dim rounded-lg group-hover:bg-primary/5 transition-colors">
                        <Box size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">Secure Packaging</span>
                        <span className="text-xs text-foreground-muted">Safe & eco-friendly</span>
                    </div>
                </div>
            </motion.div>

            {/* Tabs Section */}
            <div className="pt-12">
                <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar scroll-smooth">
                    {(['description', 'specifications', 'reviews'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            className={`pb-4 px-6 md:px-10 font-bold text-[13px] uppercase tracking-[0.15em] transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab
                                ? 'text-primary border-primary'
                                : 'text-foreground-muted hover:text-black border-transparent'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'description' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {product.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="p-8 rounded-2xl bg-background-dim border border-border space-y-4 transition-all duration-300"
                                        >
                                            {getFeatureIcon(feature.icon)}
                                            <h4 className="font-bold text-foreground text-lg">{feature.title}</h4>
                                            <p className="text-foreground-secondary text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="max-w-2xl divide-y divide-border border-t border-b border-border">
                                    {product.specifications.map((spec, index) => (
                                        <div key={index} className="grid grid-cols-3 py-4">
                                            <span className="font-bold text-foreground text-sm uppercase tracking-wider">{spec.label}</span>
                                            <span className="col-span-2 text-foreground-secondary font-light">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    {product.reviews.map((review, index) => (
                                        <div key={index} className="p-8 rounded-2xl bg-white border border-border">
                                            <div className="flex items-center gap-1 mb-4 text-primary">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-xl ${i < review.rating ? 'fill-current text-primary' : 'text-border'}`}>★</span>
                                                ))}
                                            </div>
                                            <p className="text-foreground italic text-lg mb-4 font-light leading-relaxed">{review.text}</p>
                                            <span className="font-bold text-foreground text-sm uppercase tracking-wide">— {review.author}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}