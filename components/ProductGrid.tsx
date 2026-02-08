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
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-white shadow-sm">
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
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          <div className="flex space-x-2">
            <Link href="/best-seller" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-primary-600 hover:text-primary-600 transition">
              Best sellers
            </Link>
            <Link href="/new-arrivals" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-primary-600 hover:text-primary-600 transition">
              New arrivals
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}

