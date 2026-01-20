'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function GiftSetsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?category=Gift Sets`);
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
        <h1 className="text-4xl font-bold mb-4">Gift Sets</h1>
        <p className="text-gray-600 mb-8">
          Perfect gifts for your loved ones. Our curated gift sets include multiple fragrances, making them ideal 
          for special occasions, birthdays, anniversaries, or just to show someone you care.
        </p>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

