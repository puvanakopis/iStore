import ProductImage from './_components/ProductImage';
import ProductDetails from './_components/ProductDetails';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductGrid from '../../shop/_components/ProductGrid';
import { products as allProducts } from '@/data/productData';

async function getProduct(id: string) {
    return {
        id,
        name: 'iPhone 15 Pro',
        tagline: 'The first iPhone with an aerospace-grade titanium design',
        price: '$999',
        rating: 4.8,
        reviewCount: 1240,
        colors: [
            { name: 'Natural Titanium', value: '#bab6aa' },
            { name: 'Blue Titanium', value: '#4c5462' },
            { name: 'White Titanium', value: '#f2f1ed' },
            { name: 'Black Titanium', value: '#3b3c3e' },
        ],
        storage: [
            { size: '128GB', price: '$999' },
            { size: '256GB', price: '$1,099' },
            { size: '512GB', price: '$1,299' },
            { size: '1TB', price: '$1,499' },
        ],
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC2KiI5PxZZPkdWPIKtT8Qe6z0HtyWvNSnHyie7vfGWKnhbiACyUcJpmnOIhYJ4RO9BWIwoqKxx5BUBVvFf-eAht6gxJeYjpbyAeNzdU8psIhHYehharQ6WF-Ej1C1GLzRLv7rWuIQN0Ki2_sBA-Y3S3wq_4FkOmVBh66DcFFnx1U-nay4kUVA_UmN_mltXzU6rrxp-mvLUXrPbWYBbERQlD1NPAW3GqcJ9nfzi-jmvYnJLzeIsKQ9maAc-depueVSKi4mZewgLxmL0',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAISTMIxdKEq9zY1USxJYYuhQsV9WsPRAKNN4DurPmMLz6sgcjhK7c8HKOqYNTPt_JMp-JDV3uAQBhmxj0ljEiZCzf3Wt28u8twJjY6bV7JR8v9GOA2bcdhyJ1Vof3xGnmsZKbgmEa7WKQc3kCIzIrp_xhSySHgFLgMRZsmWmAavJTCHW0eVLjmWpiDJb3EQ9WEkMfNog1sPRCvMqcz8kD1NGPw4qbWuGDHpwXXFnBguk-WFLeObZ39-XCkpHz4Ux5f95F3-sOjiStV',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBmDppg0ReVAEef1fLs9rTcdxmv-9GWqxqP8Yu-wHHLo2OOyaWCSbuzGtOc3XwTOeYal94MSPcFNEYrRUgEsnh1tPo2UPdk3pBHW8LBCr8IvC8Ux_f2NwSoYvOxuQ-DOVPlBLlex-qv72Bkr_Jp5y-uDYhqA-U1BUdSFXoFmonqLDQFNv8BGMtSJeK3xrxe9jY4L4DJWG52cH0tODQ-K_ii9PLFe9sCtCNMKzvaSzv0BnokpKWSfsDuar9Kx-EZ2yq5JaYi_SOCjH9k',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC8ypUgDwk3Cle7JlCW8JFrN7vYx7PlNNXpn1u2Wi9-UGhBKMTPlGcYAHhsYMmKSW_Vi0uMBPfT-WSY3hGGD4czftANB6Zs062vhIN-QUoxS68PHiHrwkpB5Z8V-XJk3vQwRNvObdZl6thq2zRfaSOfbpeXDKt9L_TNuDviLg648oMS_qXcgXlYa0SLXVc5Qg_Espr5hg0zWMBHGqPdq40f3NUKMRcdXQFZq53GB9dU1ZHBOG3qE9wWMCLJHqA4Pwvw-jTSlhvNXtpK',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC75vjIIaCPWdrcsTfw2aoQzS7tLQvoy9a9uqRqt0DQC1OT9Ysvn-jiOxBGdnuor8BPurZfiiTOesiNxRi35ajNounzUZU86w7QnO4qaqaU8Hw5T7-ZuCeybariBEqP8ZnXeX2uZJhIhFhU6ZqriJA2PG9j5qWxhTUFbwyLLVBUDsIlXLjCZqLTeGVNWvA2kY6XwsJlH9-uEh7LAr25-3Gfnk_VxGy7QywCF_sDaaY2yEnaaW4eBKaL_6dxDcEl0aNHivyCzHH6THDX',
        ],
        features: [
            { icon: 'rocket_launch', title: 'A17 Pro Chip', description: 'A monster win for gaming. Our most powerful graphics processing yet in an iPhone.' },
            { icon: 'photo_camera', title: '48MP Main Camera', description: 'Capture photos with incredible detail and color, with a larger sensor than ever before.' },
            { icon: 'bolt', title: 'Action Button', description: 'A fast track to your favorite feature. Set the function you want and press to launch.' },
        ],
        specifications: [
            { label: 'Finish', value: 'Titanium (Natural, Blue, White, Black)' },
            { label: 'Capacity', value: '128GB, 256GB, 512GB, 1TB' },
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