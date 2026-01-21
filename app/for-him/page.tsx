'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

export default function ForHimPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('products?tags=Men'));
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">For Him</h1>
        <p className="text-gray-600 mb-8">
          Discover our collection of premium men&apos;s fragrances. From bold and masculine to fresh and sophisticated, 
          find the perfect scent that defines your style.
        </p>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

