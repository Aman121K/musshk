'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Banner from '@/components/Banner';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

// Below-the-fold sections: load after initial paint to reduce render blocking and main bundle
const CollectionSection = dynamic(() => import('@/components/CollectionSection'), {
  loading: () => (
    <section className="py-16 bg-gray-50" aria-hidden>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Exclusive Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: true,
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => (
    <section className="py-16 bg-gray-50 min-h-[320px]" aria-hidden>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: true,
});

const MarketplaceSection = dynamic(() => import('@/components/MarketplaceSection'), {
  loading: () => (
    <section className="py-16 bg-gray-50 min-h-[120px]" aria-hidden>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
      </div>
    </section>
  ),
  ssr: true,
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('products?limit=12'));
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Banner position="home-top" />
      <CollectionSection />
      <ProductGrid 
        title="Our Most Loved Scents" 
        products={products} 
        loading={loading}
      />
      <Testimonials />
      <MarketplaceSection />
    </div>
  );
}

