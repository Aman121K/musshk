'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';

interface CategoryProductRef {
  _id?: string;
}

interface CategoryItem {
  _id: string;
  slug: string;
  name?: string;
  image?: string;
  featured?: boolean;
  order?: number;
  productIds?: Array<string | CategoryProductRef>;
}

interface RenderCollection {
  slug: string;
  name: string;
  href: string;
  imageUrl: string;
}

function productIdCount(category: CategoryItem): number {
  if (!Array.isArray(category.productIds)) return 0;
  return category.productIds
    .map((p) => (typeof p === 'string' ? p : p?._id || ''))
    .filter(Boolean).length;
}

export default function CollectionSection() {
  const [collectionsToRender, setCollectionsToRender] = useState<RenderCollection[]>([]);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const categoryRes = await fetch(getApiUrl('categories'));
        if (!categoryRes.ok) {
          throw new Error(`Failed categories API: ${categoryRes.status}`);
        }
        const categoryData = await categoryRes.json();
        const categories: CategoryItem[] = Array.isArray(categoryData) ? categoryData : [];

        const sortedCategories = categories
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        const collections: RenderCollection[] = [];

        for (const category of sortedCategories) {
          const slug = String(category.slug || '').trim();
          if (!slug) continue;

          // Strictly admin-driven: show only categories having assigned products.
          if (productIdCount(category) === 0) continue;

          collections.push({
            slug,
            name: (category.name || '').trim() || slug.replace(/-/g, ' '),
            href: `/category/${slug}`,
            imageUrl: category.image ? getImageUrl(category.image) : '',
          });
        }
        console.log('[CollectionSection] categories from API:', categories);
        console.log('[CollectionSection] collections to render:', collections);
        console.log("data from website>>>", collections);

        setCollectionsToRender(collections);
      } catch (error) {
        console.error('[CollectionSection] failed to load collections:', error);
        setCollectionsToRender([]);
      }
    };

    fetchCollections();
  }, []);

  if (collectionsToRender.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-[#f7f5f3] content-visibility-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-aesop-ink text-center mb-14 tracking-tight">Our Exclusive Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {collectionsToRender.map((collection) => {
            const showPlaceholder = !collection.imageUrl || failed[collection.slug];
            return (
              <Link
                key={collection.slug}
                href={collection.href}
                className="group relative overflow-hidden bg-white transition-opacity hover:opacity-95"
              >
                <div className="aspect-square bg-[#f5f3f0] relative overflow-hidden">
                  {collection.imageUrl && !failed[collection.slug] && (
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={80}
                      unoptimized
                      onError={() => setFailed((prev) => ({ ...prev, [collection.slug]: true }))}
                    />
                  )}
                  {showPlaceholder && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading font-medium text-aesop-ink text-base group-hover:opacity-80 transition">
                    {collection.name}
                  </h3>
                  <p className="text-[11px] text-aesop-graphite mt-2 tracking-[0.12em] uppercase">Explore</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
