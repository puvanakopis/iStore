"use client";

import { useEffect, useState, use } from "react";
import ProductImage from './_components/ProductImage';
import ProductDetails from './_components/ProductDetails';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductGrid from '../../shop/_components/ProductGrid';
import { useProducts } from '@/contexts/ProductContext';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { products, getProduct, loading: contextLoading } = useProducts();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string>("");

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            const data = await getProduct(id);
            if (data) {
                // Map the data based on product_model.py schema
                const mappedProduct = {
                    id: data.id,
                    name: data.title,
                    tagline: data.subtitle || 'Experience the future of technology with premium features.',
                    price: data.price,
                    imageSrc: data.imageSrc,
                    rating: 4.8,
                    reviewCount: data.reviews?.length || 120,
                    colors: data.colors && data.colors.length > 0
                        ? data.colors.map(c => ({ name: c.name, value: c.hex, images: c.images || [] }))
                        : [{ name: 'Default', value: '#000000', images: [] }],
                    storage: data.storage && data.storage.length > 0
                        ? data.storage.map(s => ({ size: s.size, price: s.price }))
                        : [{ size: 'Base', price: data.price }],
                    images: data.colors && data.colors.flatMap(c => c.images).filter(Boolean).length > 0
                        ? data.colors.flatMap(c => c.images).filter(Boolean)
                        : [data.imageSrc],
                    features: data.features && data.features.length > 0
                        ? data.features
                        : [
                            { icon: 'rocket_launch', title: 'High Performance', description: 'Engineered with cutting edge hardware for unparalleled speeds.' },
                            { icon: 'photo_camera', title: 'Advanced Camera', description: 'Professional grade capture lenses that bring scenes to life.' },
                            { icon: 'bolt', title: 'Efficiency', description: 'Long lasting utility with optimized power management.' },
                        ],
                    specifications: [
                        { label: 'Finish', value: data.specifications?.finish || data.colors?.map(c => c.name).join(', ') || 'N/A' },
                        { label: 'Capacity', value: data.specifications?.capacity || data.storage?.map(s => s.size).join(', ') || 'N/A' },
                        { label: 'Display', value: data.specifications?.display || 'N/A' },
                        { label: 'Chip', value: data.specifications?.chip || 'N/A' },
                    ],
                    reviews: data.reviews && data.reviews.length > 0
                        ? data.reviews.map(r => ({ rating: r.rating, text: r.comment, author: r.name }))
                        : [
                            { rating: 5, text: '"Absolutely stunning design and performance. Exceeded all of my expectations."', author: 'Alex M.' },
                            { rating: 5, text: '"Best tech purchase of the year. The details and materials are premium."', author: 'Taylor S.' },
                        ],
                };
                setProduct(mappedProduct);
                if (mappedProduct.colors && mappedProduct.colors.length > 0) {
                    setSelectedColor(mappedProduct.colors[0].name);
                }
            }
            setLoading(false);
        };
        fetchProductData();
    }, [id, getProduct]);

    const relatedProducts = products.filter(p => p.id !== id).slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt || p.title,
        rating: 4.5,
        reviewCount: 120,
        isNew: true
    }));

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-950"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link href="/shop" className="text-primary hover:underline">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
            {/* Breadcrumb section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
                <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
                    <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} />
                        Back to Shop
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
                </nav>
            </section>

            <section className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {(() => {
                        const activeColorObj = product.colors.find((c: any) => c.name === selectedColor) || product.colors[0];
                        const currentImages = [product.imageSrc].filter(Boolean);
                        if (activeColorObj?.images) {
                            activeColorObj.images.forEach((img: string) => {
                                if (img && !currentImages.includes(img)) {
                                    currentImages.push(img);
                                }
                            });
                        }
                        return <ProductImage images={currentImages.length > 0 ? currentImages : [product.images[0]]} productName={product.name} />;
                    })()}
                    <ProductDetails 
                        product={product} 
                        selectedColor={selectedColor} 
                        onColorSelect={setSelectedColor} 
                    />
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 md:px-12 mt-32 pt-20 border-t border-border">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[12px] mb-4 block">You may also like</span>
                            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-gray-900 leading-tight">Complete your <br /> collection.</h2>
                        </div>
                        <Link href="/shop" className="hidden md:block text-sm font-bold border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity">
                            View all products
                        </Link>
                    </div>
                    <ProductGrid products={relatedProducts} />
                </section>
            )}
        </main>
    );
}