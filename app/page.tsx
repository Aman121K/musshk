'use client';

import { useEffect, useState } from 'react';
import Banner from '@/components/Banner';
import CollectionSection from '@/components/CollectionSection';
import ProductGrid from '@/components/ProductGrid';
import Testimonials from '@/components/Testimonials';
import MarketplaceSection from '@/components/MarketplaceSection';
import { getApiUrl } from '@/lib/api';

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

