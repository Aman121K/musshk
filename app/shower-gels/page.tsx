'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ShowerGelsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?category=Shower Gel`);
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
        <h1 className="text-4xl font-bold mb-4">Shower Gels</h1>
        <p className="text-gray-600 mb-8">
          Complete your fragrance routine with our luxurious shower gels. Infused with the same premium scents as 
          our perfumes, these shower gels leave you feeling fresh and confident all day long.
        </p>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

