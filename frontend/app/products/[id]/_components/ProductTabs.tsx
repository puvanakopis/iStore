'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Camera, Zap, Shield, Sparkles, BatteryCharging, Smartphone, CheckCircle2 } from 'lucide-react';
import StarRating from '@/components/StarRating';

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

interface ProductTabsProps {
    product: Product;
}

type TabType = 'description' | 'specifications' | 'reviews';

export default function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('description');

    const getFeatureIcon = (icon: string) => {
        switch (icon) {
            case 'rocket_launch':
                return <Cpu className="w-7 h-7 text-primary" />;
            case 'photo_camera':
                return <Camera className="w-7 h-7 text-primary" />;
            case 'bolt':
                return <Zap className="w-7 h-7 text-primary" />;
            case 'battery':
                return <BatteryCharging className="w-7 h-7 text-primary" />;
            case 'shield':
                return <Shield className="w-7 h-7 text-primary" />;
            default:
                return <Sparkles className="w-7 h-7 text-primary" />;
        }
    };

    const tabs: { id: TabType; label: string; count?: number }[] = [
        { id: 'description', label: 'Description' },
        { id: 'specifications', label: 'Specifications', count: product.specifications?.length },
        { id: 'reviews', label: 'Reviews', count: product.reviews?.length || product.reviewCount },
    ];

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="flex border-b border-border mb-10 overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`relative pb-4 px-6 md:px-10 font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'text-primary'
                                : 'text-foreground-muted hover:text-black'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-background-dim text-foreground-muted'
                                }`}
                            >
                                {tab.count}
                            </span>
                        )}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[320px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Description / Features */}
                        {activeTab === 'description' && (
                            <div className="space-y-12">
                                <div className="max-w-3xl">
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                                        Designed for performance and elegance.
                                    </h3>
                                    <p className="text-foreground-secondary text-base md:text-lg font-light leading-relaxed">
                                        {product.tagline} Built with cutting-edge engineering and premium materials to deliver an unmatched user experience.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {product.features && product.features.length > 0 ? (
                                        product.features.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="p-8 rounded-2xl bg-background-dim/60 border border-border space-y-4 hover:border-primary/30 transition-all duration-300 group"
                                            >
                                                <div className="p-3 bg-white w-fit rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-300">
                                                    {getFeatureIcon(feature.icon)}
                                                </div>
                                                <h4 className="font-bold text-foreground text-lg">{feature.title}</h4>
                                                <p className="text-foreground-secondary text-sm leading-relaxed">{feature.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 text-center py-12 text-foreground-muted">
                                            No feature highlights available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        {activeTab === 'specifications' && (
                            <div className="space-y-6">
                                <div className="max-w-3xl mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                                        Technical Specifications
                                    </h3>
                                    <p className="text-foreground-secondary text-sm md:text-base font-light">
                                        Detailed breakdown of hardware, dimensions, and system specifications.
                                    </p>
                                </div>

                                {product.specifications && product.specifications.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                                        {product.specifications.map((spec, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-background-dim/50 border border-border/80 hover:bg-background-dim transition-colors"
                                            >
                                                <span className="font-semibold text-foreground text-sm tracking-wide mb-1 sm:mb-0">
                                                    {spec.label}
                                                </span>
                                                <span className="text-foreground-secondary text-sm font-light text-left sm:text-right">
                                                    {spec.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-foreground-muted">
                                        No specifications available for this product.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl bg-background-dim/50 border border-border">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                            Customer Reviews
                                        </h3>
                                        <p className="text-foreground-secondary text-sm mt-1">
                                            Real feedback from verified purchasers.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-foreground">
                                                {product.rating ? product.rating.toFixed(1) : '4.8'}
                                            </div>
                                            <div className="text-xs text-foreground-muted">out of 5.0</div>
                                        </div>
                                        <StarRating rating={product.rating || 4.8} size={20} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="p-8 rounded-2xl bg-white border border-border hover:border-primary/20 shadow-xs flex flex-col justify-between space-y-6"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <StarRating rating={review.rating} size={16} />
                                                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                            <CheckCircle2 size={12} /> Verified Purchase
                                                        </span>
                                                    </div>
                                                    <p className="text-foreground italic text-base md:text-lg font-light leading-relaxed">
                                                        {review.text}
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t border-border/50">
                                                    <span className="font-bold text-foreground text-sm uppercase tracking-wide">
                                                        — {review.author}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-12 text-center text-foreground-muted">
                                            No reviews yet for this product.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
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
