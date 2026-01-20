'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ForHerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?tags=Women`);
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
        <h1 className="text-4xl font-bold mb-4">For Her</h1>
        <p className="text-gray-600 mb-8">
          Explore our elegant collection of women&apos;s fragrances. From floral and feminine to bold and confident, 
          find the perfect scent that complements your personality.
        </p>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

