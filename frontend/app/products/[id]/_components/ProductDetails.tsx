'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Truck, RotateCcw, ShieldCheck, Share2, Box, Layers, Check, ArrowRight } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/CheckoutContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { useProducts } from '@/contexts/ProductContext';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    tagline: string;
    price: string;
    imageSrc?: string;
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

export default function ProductDetails({ product, selectedColor, onColorSelect }: ProductDetailsProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { startCheckout } = useCheckout();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { toggleCompare, isInCompare, addToCompare } = useCompare();
    const { products } = useProducts();
    const inWishlist = isInWishlist(product.id);
    const inCompare = isInCompare(product.id);

    const handleCompare = () => {
        const fullProduct = products.find((p) => p.id === product.id);
        if (fullProduct) {
            toggleCompare(fullProduct);
        } else {
            toggleCompare({
                id: product.id,
                title: product.name,
                subtitle: product.tagline,
                price: product.price,
                imageSrc: product.imageSrc || '',
                colors: product.colors.map(c => ({ name: c.name, hex: c.value, images: c.images || [] })),
                storage: product.storage,
                features: product.features,
                reviews: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    };

    const [selectedStorage, setSelectedStorage] = useState(product.storage[0].size);
    const [quantity, setQuantity] = useState(1);

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleColorSelect = (colorName: string) => {
        onColorSelect(colorName);
    };

    const handleStorageSelect = (storageSize: string) => {
        setSelectedStorage(storageSize);
    };

    const handleCheckout = () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        const currentPrice = product.storage.find(s => s.size === selectedStorage)?.price || product.price;

        const activeColorObj = product.colors.find(c => c.name === selectedColor);
        const imageSrc = (activeColorObj?.images && activeColorObj.images.length > 0)
            ? activeColorObj.images[0]
            : product.imageSrc || '';

        startCheckout({
            product_id: product.id,
            quantity,
            color: selectedColor,
            storage: selectedStorage,
            title: product.name,
            price: currentPrice,
            imageSrc,
        });
    };

    const handleFavorite = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        const activeColorObj = product.colors.find(c => c.name === selectedColor);
        const imageSrc = (activeColorObj?.images && activeColorObj.images.length > 0)
            ? activeColorObj.images[0]
            : product.imageSrc || '';

        try {
            await toggleWishlist({
                product_id: product.id,
                title: product.name,
                price: product.price,
                imageSrc: imageSrc,
            });
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
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
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
                <button
                    className={`p-4 border rounded-full hover:bg-background-dim transition-all duration-300 hover:scale-110 group ${
                        inWishlist ? 'border-red-100 text-red-500 bg-red-50/50' : 'border-border text-foreground-secondary'
                    }`}
                    onClick={handleFavorite}
                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart className={`${inWishlist ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500 group-hover:text-red-500'} transition-colors`} size={24} />
                </button>
                <button
                    className={`p-4 border rounded-full transition-all duration-300 hover:scale-110 group ${
                        inCompare ? 'border-black bg-black text-white' : 'border-border text-foreground-secondary hover:bg-background-dim'
                    }`}
                    onClick={handleCompare}
                    title={inCompare ? "Remove from comparison" : "Add to comparison"}
                >
                    {inCompare ? <Check size={24} /> : <Layers className="group-hover:rotate-6 transition-transform" size={24} />}
                </button>
            </motion.div>

            {/* Compare banner prompt */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="bg-black/[0.03] border border-black/5 rounded-2xl p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center">
                        <Layers size={18} className="text-black" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-black">Compare with other models</p>
                        <p className="text-[11px] text-black/50">Side-by-side specs, camera & battery</p>
                    </div>
                </div>
                <Link
                    href="/compare"
                    onClick={() => {
                        const fullProduct = products.find((p) => p.id === product.id);
                        if (fullProduct && !inCompare) {
                            addToCompare(fullProduct);
                        }
                    }}
                    className="text-xs font-bold text-black hover:opacity-70 flex items-center gap-1 bg-white px-3.5 py-2 rounded-xl border border-black/10 shadow-sm transition-all"
                >
                    <span>Compare</span>
                    <ArrowRight size={13} />
                </Link>
            </motion.div>

            {/* Guarantee / Value props */}
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
        </div>
    );
}