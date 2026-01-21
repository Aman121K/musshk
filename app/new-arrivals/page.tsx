'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('products?newArrival=true'));
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
        <h1 className="text-4xl font-bold mb-8">New Arrivals</h1>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

