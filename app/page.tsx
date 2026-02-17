'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Banner from '@/components/Banner';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

// Below-the-fold sections: load after initial paint to reduce render blocking and main bundle
const CollectionSection = dynamic(() => import('@/components/CollectionSection'), {
  loading: () => (
    <section className="py-20 bg-[#f7f5f3]" aria-hidden>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-9 bg-black/5 w-64 mx-auto mb-14 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-aesop-cream animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: true,
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => (
    <section className="py-20 bg-white min-h-[320px]" aria-hidden>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-9 bg-black/5 w-56 mx-auto mb-14 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-white border border-aesop-stone/30 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: true,
});

const MarketplaceSection = dynamic(() => import('@/components/MarketplaceSection'), {
  loading: () => (
    <section className="py-20 bg-[#f7f5f3] min-h-[120px]" aria-hidden>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-9 bg-aesop-stone/20 w-64 mx-auto animate-pulse" />
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
    <div className="min-h-screen bg-white">
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

