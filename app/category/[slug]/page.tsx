'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/lib/api';

interface CategoryProductRef {
  _id?: string;
}

interface CategoryData {
  name?: string;
  slug?: string;
  productIds?: Array<string | CategoryProductRef>;
}

export default function DynamicCategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || '');

  const [title, setTitle] = useState('Category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchCategoryProducts();
  }, [slug]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const categoryRes = await fetch(getApiUrl(`categories/${slug}`));
      const categoryData: CategoryData = await categoryRes.json();
      const categoryName = (categoryData?.name || '').trim();
      if (categoryName) setTitle(categoryName);

      const productIds = Array.isArray(categoryData?.productIds)
        ? categoryData.productIds
            .map((item) => (typeof item === 'string' ? item : item?._id || ''))
            .filter(Boolean)
        : [];

      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      const url = getApiUrl(`products?ids=${encodeURIComponent(productIds.join(','))}&limit=500`);
      const productRes = await fetch(url);
      const productData = await productRes.json();
      setProducts(productData?.products || []);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <ProductGrid products={products} loading={loading} title="" />
      </div>
    </div>
  );
}
