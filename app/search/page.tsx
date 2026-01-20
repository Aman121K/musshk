'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Products</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for perfumes, fragrances..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Searching...' : products.length > 0 
              ? `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Enter a search term to find products</p>
          <div className="text-gray-400">
            <p className="mb-2">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Sauvage', 'Aventus', 'Oud Wood', 'Cool Water', 'One Million'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    performSearch(term);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ProductGrid products={products} loading={loading} title="" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

