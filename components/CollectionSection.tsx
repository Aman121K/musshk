'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';

interface HomeCollectionConfig {
  slug: string;
  defaultName: string;
  href: string;
  queries: string[];
}

interface RenderCollection {
  slug: string;
  name: string;
  href: string;
  imageUrl: string;
}

const homeCollections: HomeCollectionConfig[] = [
  { slug: 'best-seller', defaultName: 'Best Seller', href: '/best-seller', queries: ['bestSeller=true&limit=1', 'collection=Best%20Seller&limit=1'] },
  { slug: 'niche-edition', defaultName: 'Niche Edition', href: '/niche-edition', queries: ['collection=Niche%20Edition&limit=1'] },
  { slug: 'inspired-perfumes', defaultName: 'Inspired Perfumes', href: '/inspired-perfumes', queries: ['collection=Inspired%20Perfumes&limit=1'] },
  { slug: 'new-arrivals', defaultName: 'New Arrivals', href: '/new-arrivals', queries: ['newArrival=true&limit=1', 'collection=New%20Arrivals&limit=1'] },
];

const homeCollectionSlugs = new Set(homeCollections.map((item) => item.slug));

export default function CollectionSection() {
  const [collectionsToRender, setCollectionsToRender] = useState<RenderCollection[]>([]);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchImages = async () => {
      let categoryMap: Record<string, { name?: string; image?: string }> = {};

      try {
        const categoryRes = await fetch(getApiUrl('categories'));
        const categoryData = await categoryRes.json();
        if (Array.isArray(categoryData)) {
          categoryMap = categoryData
            .filter((category) => category?.slug && homeCollectionSlugs.has(category.slug))
            .reduce((acc, category) => {
              acc[category.slug] = {
                name: category?.name,
                image: category?.image ? getImageUrl(category.image) : '',
              };
              return acc;
            }, {} as Record<string, { name?: string; image?: string }>);
        }
      } catch {
        // ignore category config failure and use defaults
      }

      const availableCollections: RenderCollection[] = [];
      for (const col of homeCollections) {
        let productImage = '';
        let hasProducts = false;

        for (const query of col.queries) {
          try {
            const res = await fetch(getApiUrl(`products?${query}`));
            const data = await res.json();
            const product = data.products?.[0];
            const src = product?.images?.[0];
            if (product) {
              hasProducts = true;
            }
            if (src && !productImage) {
              productImage = getImageUrl(src);
            }
            if (hasProducts && productImage) {
              break;
            }
          } catch {
            // try next query
          }
        }

        if (!hasProducts) {
          continue;
        }

        const adminCategory = categoryMap[col.slug];
        const imageUrl = adminCategory?.image || productImage;

        availableCollections.push({
          slug: col.slug,
          name: adminCategory?.name?.trim() || col.defaultName,
          href: col.href,
          imageUrl,
        });
      }

      setCollectionsToRender(availableCollections);
    };

    fetchImages();
  }, []);

  if (collectionsToRender.length === 0) {
    return null;
  }

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
                      onError={() => setFailed((f) => ({ ...f, [collection.slug]: true }))}
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
