'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

export default function NewArrivalsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const date = searchParams.get('date');
    setSelectedDate(date);
    fetchProducts(date);
  }, [searchParams]);

  const fetchProducts = async (date: string | null = null) => {
    try {
      let url = getApiUrl('products?collection=New Arrivals');
      if (date) {
        url = getApiUrl(`products?collection=New Arrivals&newArrivalDate=${encodeURIComponent(date)}`);
      }
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const dateOptions = ['SEPTEMBER - 2025', 'July-2025', 'MARCH- 2025'];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
        
        {/* Date Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedDate(null);
              fetchProducts(null);
            }}
            className={`px-4 py-2 rounded-md font-medium transition ${
              selectedDate === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {dateOptions.map((date) => (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                fetchProducts(date);
              }}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedDate === date
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}

