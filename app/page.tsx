'use client';

import { useEffect, useState } from 'react';
import HeroSlider from '@/components/HeroSlider';
import CollectionSection from '@/components/CollectionSection';
import ProductGrid from '@/components/ProductGrid';
import Testimonials from '@/components/Testimonials';
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
    <div>
      <HeroSlider />
      <CollectionSection />
      <ProductGrid 
        title="Our Most Loved Scents" 
        products={products} 
        loading={loading}
      />
      <Testimonials />
    </div>
  );
}

