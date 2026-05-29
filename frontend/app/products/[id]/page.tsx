import ProductImage from './_components/ProductImage';
import ProductDetails from './_components/ProductDetails';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductGrid from '../../shop/_components/ProductGrid';
import { products as allProducts } from '@/data/productData';

async function getProduct(id: string) {
    const product = allProducts.find(p => p.id.toString() === id);
    if (!product) return null;

    return {
        ...product,
        name: product.title,
        tagline: product.subtitle || 'The first iPhone with an aerospace-grade titanium design',
        price: product.price,
        rating: 4.8,
        reviewCount: 1240,
        colors: product.colors?.map(c => ({ name: c.name, value: c.hex })) || [
            { name: 'Natural Titanium', value: '#bab6aa' },
            { name: 'Blue Titanium', value: '#4c5462' },
            { name: 'White Titanium', value: '#f2f1ed' },
            { name: 'Black Titanium', value: '#3b3c3e' },
        ],
        storage: product.storage?.map(s => ({ size: s.size, price: s.price })) || [
            { size: '128GB', price: '$999' },
            { size: '256GB', price: '$1,099' },
            { size: '512GB', price: '$1,299' },
            { size: '1TB', price: '$1,499' },
        ],
        images: product.colors?.[0]?.images || [product.imageSrc],
        features: product.features || [
            { icon: 'rocket_launch', title: 'A17 Pro Chip', description: 'A monster win for gaming. Our most powerful graphics processing yet in an iPhone.' },
            { icon: 'photo_camera', title: '48MP Main Camera', description: 'Capture photos with incredible detail and color, with a larger sensor than ever before.' },
            { icon: 'bolt', title: 'Action Button', description: 'A fast track to your favorite feature. Set the function you want and press to launch.' },
        ],
        specifications: [
            { label: 'Finish', value: product.colors?.map(c => c.name).join(', ') || 'Titanium (Natural, Blue, White, Black)' },
            { label: 'Capacity', value: product.storage?.map(s => s.size).join(', ') || '128GB, 256GB, 512GB, 1TB' },
            { label: 'Display', value: '6.1-inch Super Retina XDR' },
            { label: 'Chip', value: 'A17 Pro Chip, 6-core GPU' },
        ],
        reviews: [
            { rating: 5, text: '"The titanium feels incredibly light compared to my old Pro. It\'s like holding the future."', author: 'James W.' },
            { rating: 5, text: '"The camera system is revolutionary for my content creation. Highly recommend the 1TB."', author: 'Sarah L.' },
        ],
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    const relatedProducts = allProducts.slice(0, 3).map(p => ({
        title: p.title,
        price: p.price,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
        rating: 4.5,
        reviewCount: 120,
        isNew: true
    }));

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
                    <ProductImage images={product.images} productName={product.name} />
                    <ProductDetails product={product} />
                </div>
            </section>

            {/* Related Products Section */}
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
        </main>
    );
}