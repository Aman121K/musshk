'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  name: string;
  slug: string;
  code: string;
  price: number;
  originalPrice?: number;
  images: string[];
  soldOut: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ title, products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-aesop-ink mb-12 tracking-tight">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden bg-[#f5f3f0]">
                <div className="bg-gray-100 aspect-square"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-100 rounded w-1/3 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-aesop-ink tracking-tight">{title}</h2>
          <div className="flex gap-4">
            <Link href="/best-seller" className="px-5 py-2.5 border border-black/20 text-aesop-ink text-[11px] tracking-[0.15em] uppercase hover:border-black hover:bg-black hover:text-white transition">
              Best sellers
            </Link>
            <Link href="/new-arrivals" className="px-5 py-2.5 border border-black/20 text-aesop-ink text-[11px] tracking-[0.15em] uppercase hover:border-black hover:bg-black hover:text-white transition">
              New arrivals
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-aesop-graphite">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}

